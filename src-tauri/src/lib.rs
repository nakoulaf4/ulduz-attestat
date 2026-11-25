pub mod network;
pub mod scoring;
pub mod storage;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default();

    #[cfg(mobile)]
    let builder = builder.plugin(tauri_plugin_haptics::init());

    builder
        .invoke_handler(tauri::generate_handler![
            scoring::score_exam_dim,
            storage::load_progress,
            storage::save_progress,
            storage::export_progress_file,
            storage::app_info,
            network::check_github_update,
            network::ai_chat_completion,
            network::ai_list_models,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Ulduz Tauri application");
}
