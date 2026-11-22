import java.io.File
import org.apache.tools.ant.taskdefs.condition.Os
import org.gradle.api.DefaultTask
import org.gradle.api.GradleException
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.TaskAction
import javax.inject.Inject
import org.gradle.process.ExecOperations

abstract class BuildTask : DefaultTask() {
    @get:Inject
    abstract val execOperations: ExecOperations

    @Input
    var rootDirRel: String? = null
    @Input
    var projectDir: String? = null
    @Input
    var target: String? = null
    @Input
    var release: Boolean? = null

    @TaskAction
    fun assemble() {
        val rootDirRel = rootDirRel ?: throw GradleException("rootDirRel cannot be null")
        val projectDirPath = projectDir ?: throw GradleException("projectDir cannot be null")
        val target = target ?: throw GradleException("target cannot be null")
        val isRelease = release ?: throw GradleException("release cannot be null")

        val appProjectDir = File(projectDirPath)
        val tauriDir = File(appProjectDir, rootDirRel).canonicalFile
        val repoRootDir = tauriDir.parentFile

        val (rustTriple, androidAbi, clangPrefix) = when (target) {
            "aarch64" -> Triple("aarch64-linux-android", "arm64-v8a", "aarch64-linux-android24")
            "armv7" -> Triple("armv7-linux-androideabi", "armeabi-v7a", "armv7a-linux-androideabi24")
            "i686" -> Triple("i686-linux-android", "x86", "i686-linux-android24")
            "x86_64" -> Triple("x86_64-linux-android", "x86_64", "x86_64-linux-android24")
            else -> throw GradleException("Unsupported Android Rust target: $target")
        }

        val isWindows = Os.isFamily(Os.FAMILY_WINDOWS)
        val ndkHome = System.getenv("NDK_HOME")
            ?: System.getenv("ANDROID_NDK_HOME")
            ?: throw GradleException("NDK_HOME environment variable is not set")
        val prebuiltRoot = File(ndkHome, "toolchains/llvm/prebuilt")
        val hostDir = prebuiltRoot.listFiles()?.firstOrNull { it.isDirectory }
            ?: throw GradleException("No NDK llvm prebuilt directory found under ${prebuiltRoot.absolutePath}")
        val binDir = File(hostDir, "bin")

        val clangExt = if (isWindows) ".cmd" else ""
        val exeExt = if (isWindows) ".exe" else ""
        val clangPath = File(binDir, "$clangPrefix-clang$clangExt").absolutePath
        val clangxxPath = File(binDir, "$clangPrefix-clang++$clangExt").absolutePath
        val arPath = File(binDir, "llvm-ar$exeExt").absolutePath
        val ranlibPath = File(binDir, "llvm-ranlib$exeExt").absolutePath

        val tripleEnvUpper = rustTriple.uppercase().replace('-', '_')
        val tripleEnvLower = rustTriple.replace('-', '_')

        val profileDir = if (isRelease) "release" else "debug"
        val cargoExec = if (isWindows) "cargo.exe" else "cargo"
        val cargoArgs = mutableListOf(
            "build",
            "--package", "ulduz",
            "--manifest-path", File(tauriDir, "Cargo.toml").absolutePath,
            "--target", rustTriple,
            "--features", "tauri/custom-protocol",
            "--lib"
        )
        if (isRelease) {
            cargoArgs.add("--release")
        }

        execOperations.exec {
            workingDir(tauriDir)
            executable(cargoExec)
            args(cargoArgs)
            environment("CARGO_TARGET_${tripleEnvUpper}_LINKER", clangPath)
            environment("CARGO_TARGET_${tripleEnvUpper}_AR", arPath)
            environment("CC_$tripleEnvLower", clangPath)
            environment("CXX_$tripleEnvLower", clangxxPath)
            environment("AR_$tripleEnvLower", arPath)
            environment("RANLIB_$tripleEnvLower", ranlibPath)
        }.assertNormalExitValue()

        val builtSo = File(tauriDir, "target/$rustTriple/$profileDir/libulduz_lib.so")
        if (!builtSo.exists()) {
            throw GradleException("Expected compiled Rust library not found at: ${builtSo.absolutePath}")
        }

        val jniOutDir = File(appProjectDir, "src/main/jniLibs/$androidAbi")
        jniOutDir.mkdirs()
        val destSo = File(jniOutDir, "libulduz_lib.so")
        if (destSo.exists()) {
            destSo.delete()
        }
        builtSo.copyTo(destSo, overwrite = true)

        val siteDir = File(repoRootDir, "site")
        val assetsDir = File(appProjectDir, "src/main/assets")
        if (siteDir.exists()) {
            if (assetsDir.exists()) {
                assetsDir.deleteRecursively()
            }
            siteDir.copyRecursively(assetsDir, overwrite = true)
        }
    }
}
