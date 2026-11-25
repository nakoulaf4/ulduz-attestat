//! Official DİM (Dövlət İmtahan Mərkəzi) 11th-grade Attestat / Buraxılış exam scoring engine.
//!
//! Aligns 100% with `docs/research.md` and `site/js/core/scoring.js`:
//! - `math`: 25 tasks (13 closed × 1 + 5 short × 1 + 7 open × 2 = 32), `round(25/8 * W, 1)`
//! - `ru`:   30 tasks (20 closed × 1 + 10 open × 2 = 40), `round(2.5 * W, 1)`
//! - `az`:   30 tasks (20 closed × 1 + 10 open × 2 = 40), `round(2.5 * W, 1)`
//! - `en`:   30 tasks (23 closed × 1 + 7 open × 2 = 37), `round(100/37 * W, 1)`
//! - Zero negative marking: wrong or unanswered items never deduct points.
//! - Grade thresholds on 100-point scale: `< 10` (below), `10..40` (college-min),
//!   `40..65` (satisfactory), `65..85` (good), `>= 85` (excellent).

use serde::{Deserialize, Serialize};

/// Official DİM maximum weighted raw points for each 11th-grade exam subject.
pub const MATH_RAW_MAX: f64 = 32.0;
pub const RU_RAW_MAX: f64 = 40.0;
pub const AZ_RAW_MAX: f64 = 40.0;
pub const EN_RAW_MAX: f64 = 37.0;
pub const BLOCK_RAW_MAX: f64 = 33.0;

/// Target passing benchmark on the 100-point scale used across the trainer UI.
pub const DEFAULT_PASS_THRESHOLD: f64 = 40.0;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Subject {
    Math,
    Ru,
    Az,
    En,
    Physics,
    Chemistry,
    Biology,
    History,
    Geography,
    Informatics,
}

impl Subject {
    /// Parse a subject identifier (Buraxılış + Qəbul I–IV), case-insensitively.
    pub fn parse(raw: &str) -> Result<Self, String> {
        match raw.trim().to_ascii_lowercase().as_str() {
            "math" => Ok(Self::Math),
            "ru" => Ok(Self::Ru),
            "az" => Ok(Self::Az),
            "en" => Ok(Self::En),
            "physics" => Ok(Self::Physics),
            "chemistry" => Ok(Self::Chemistry),
            "biology" => Ok(Self::Biology),
            "history" => Ok(Self::History),
            "geography" => Ok(Self::Geography),
            "informatics" => Ok(Self::Informatics),
            other => Err(format!(
                "Unsupported subject '{other}': expected a valid DİM subject id"
            )),
        }
    }

    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Math => "math",
            Self::Ru => "ru",
            Self::Az => "az",
            Self::En => "en",
            Self::Physics => "physics",
            Self::Chemistry => "chemistry",
            Self::Biology => "biology",
            Self::History => "history",
            Self::Geography => "geography",
            Self::Informatics => "informatics",
        }
    }

    /// Official weighted raw maximum (`W_max`) for a full DİM exam variant.
    pub const fn official_raw_max(self) -> f64 {
        match self {
            Self::Math => MATH_RAW_MAX,
            Self::Ru => RU_RAW_MAX,
            Self::Az => AZ_RAW_MAX,
            Self::En => EN_RAW_MAX,
            Self::Physics
            | Self::Chemistry
            | Self::Biology
            | Self::History
            | Self::Geography
            | Self::Informatics => BLOCK_RAW_MAX,
        }
    }

    /// Official DİM scale multiplier (`100 / W_max`) for a full exam variant.
    pub const fn official_multiplier(self) -> f64 {
        match self {
            Self::Math => 25.0 / 8.0,
            Self::Ru | Self::Az => 2.5,
            Self::En => 100.0 / 37.0,
            Self::Physics
            | Self::Chemistry
            | Self::Biology
            | Self::History
            | Self::Geography
            | Self::Informatics => 100.0 / BLOCK_RAW_MAX,
        }
    }

    pub const fn formula_label(self) -> &'static str {
        match self {
            Self::Math => "round((25 / 8) * W, 1)",
            Self::Ru | Self::Az => "round(2.5 * W, 1)",
            Self::En => "round((100 / 37) * W, 1)",
            Self::Physics
            | Self::Chemistry
            | Self::Biology
            | Self::History
            | Self::Geography
            | Self::Informatics => "round((100 / 33) * W, 1)",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScoreGrade {
    pub code: String,
    pub label: String,
    pub badge: String,
    pub color: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DimScoreResult {
    pub subject: String,
    pub raw_earned: f64,
    pub raw_max: f64,
    pub scaled_score: f64,
    pub scaled_max: f64,
    pub pct: u8,
    pub passed: bool,
    pub formula: String,
    pub grade: ScoreGrade,
}

/// Round a non-negative floating point number to 1 decimal place (`0.1` step),
/// matching JS `Math.round(x * 10) / 10`.
pub fn round_1(value: f64) -> f64 {
    (value * 10.0).round() / 10.0
}

/// Round to 2 decimal places for display of raw earned sums.
pub fn round_2(value: f64) -> f64 {
    (value * 100.0).round() / 100.0
}

/// Classify a scaled DİM score (`0.0..=100.0`) using the official `10 / 40 / 65 / 85` thresholds.
pub fn classify_grade(scaled_score: f64) -> ScoreGrade {
    if scaled_score >= 85.0 {
        ScoreGrade {
            code: "excellent".to_string(),
            label: "Отлично («5»)".to_string(),
            badge: "Высокий уровень".to_string(),
            color: "correct".to_string(),
        }
    } else if scaled_score >= 65.0 {
        ScoreGrade {
            code: "good".to_string(),
            label: "Хорошо («4»)".to_string(),
            badge: "Уверенный результат".to_string(),
            color: "primary".to_string(),
        }
    } else if scaled_score >= DEFAULT_PASS_THRESHOLD {
        ScoreGrade {
            code: "satisfactory".to_string(),
            label: "Удовлетворительно («3»)".to_string(),
            badge: "Базовая подготовка".to_string(),
            color: "partial".to_string(),
        }
    } else if scaled_score >= 10.0 {
        ScoreGrade {
            code: "college-min".to_string(),
            label: "Порог ссуза пройден (≥ 10 б.)".to_string(),
            badge: "Нужно усилить подготовку".to_string(),
            color: "partial".to_string(),
        }
    } else {
        ScoreGrade {
            code: "below".to_string(),
            label: "Ниже порога колледжа (< 10 б.)".to_string(),
            badge: "Требуется подготовка".to_string(),
            color: "wrong".to_string(),
        }
    }
}

/// Compute the official DİM 100-point exam score for a subject.
///
/// - Enforces zero negative marking (`raw_earned < 0.0` is clamped to `0.0`).
/// - Rejects `NaN` or infinite inputs.
/// - When `raw_max` matches the subject's official DİM weighted max (or `raw_max <= 0.0`),
///   applies the exact official DİM multiplier (`25/8`, `2.5`, or `100/37`).
/// - When a custom positive `raw_max` is provided (e.g. partial practice set), scales
///   proportionally to 100 points and clamps to `0.0..=100.0`.
pub fn score_subject(subject: &str, raw_earned: f64, raw_max: f64) -> Result<DimScoreResult, String> {
    if !raw_earned.is_finite() {
        return Err("raw_earned must be a finite number".to_string());
    }
    if !raw_max.is_finite() {
        return Err("raw_max must be a finite number".to_string());
    }

    let subj = Subject::parse(subject)?;
    let official_max = subj.official_raw_max();
    let effective_max = if raw_max > 0.0 { raw_max } else { official_max };

    // Zero negative marking on DİM 11th-grade graduation exams.
    let non_negative_earned = raw_earned.max(0.0);
    let clamped_earned = non_negative_earned.min(effective_max);

    let uses_official = (effective_max - official_max).abs() < 1e-9;
    let raw_scaled = if uses_official {
        clamped_earned * subj.official_multiplier()
    } else {
        (clamped_earned / effective_max) * 100.0
    };

    let scaled_score = round_1(raw_scaled).clamp(0.0, 100.0);
    let pct = ((clamped_earned / effective_max) * 100.0)
        .round()
        .clamp(0.0, 100.0) as u8;
    let grade = classify_grade(scaled_score);
    let formula = if uses_official {
        subj.formula_label().to_string()
    } else {
        format!("round((W / {effective_max}) * 100, 1)")
    };

    Ok(DimScoreResult {
        subject: subj.as_str().to_string(),
        raw_earned: round_2(clamped_earned),
        raw_max: round_2(effective_max),
        scaled_score,
        scaled_max: 100.0,
        pct,
        passed: scaled_score >= DEFAULT_PASS_THRESHOLD,
        formula,
        grade,
    })
}

/// Tauri command exposed to the WebView frontend for native DİM score calculation.
#[tauri::command]
pub fn score_exam_dim(
    subject: String,
    raw_earned: f64,
    raw_max: Option<f64>,
) -> Result<DimScoreResult, String> {
    let resolved_max = match raw_max {
        Some(m) => m,
        None => Subject::parse(&subject)?.official_raw_max(),
    };
    score_subject(&subject, raw_earned, resolved_max)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn math_full_score_is_100() {
        let res = score_subject("math", 32.0, 32.0).unwrap();
        assert_eq!(res.scaled_score, 100.0);
        assert_eq!(res.pct, 100);
        assert!(res.passed);
        assert_eq!(res.grade.code, "excellent");
    }

    #[test]
    fn math_only_13_closed_tasks_matches_official_example() {
        // 13 * 25/8 = 40.625 -> 40.6
        let res = score_subject("math", 13.0, 32.0).unwrap();
        assert_eq!(res.scaled_score, 40.6);
        assert!(res.passed);
        assert_eq!(res.grade.code, "satisfactory");
    }

    #[test]
    fn math_fractional_open_rubric_steps() {
        // 13 closed + 5 short + 2 open at 2/3 each (4/3 * 2 = 2.6666... raw points) -> 18 + 2.6666667 = 20.6666667
        // 20.6666667 * 3.125 = 64.583333 -> 64.6
        let earned = 18.0 + (2.0 * 2.0 / 3.0) * 2.0;
        let res = score_subject("math", earned, 32.0).unwrap();
        assert_eq!(res.scaled_score, 64.6);
        assert_eq!(res.grade.code, "satisfactory");
    }

    #[test]
    fn ru_and_az_full_and_pass_boundary() {
        let ru_full = score_subject("ru", 40.0, 40.0).unwrap();
        assert_eq!(ru_full.scaled_score, 100.0);
        assert_eq!(ru_full.grade.code, "excellent");

        // 16 closed tasks -> 16 * 2.5 = 40.0 exact pass boundary
        let az_pass = score_subject("az", 16.0, 40.0).unwrap();
        assert_eq!(az_pass.scaled_score, 40.0);
        assert!(az_pass.passed);
        assert_eq!(az_pass.grade.code, "satisfactory");
    }

    #[test]
    fn en_official_examples_match_dim_formula() {
        // Full 37 -> 100.0
        assert_eq!(score_subject("en", 37.0, 37.0).unwrap().scaled_score, 100.0);
        // 23 closed -> 2300/37 = 62.16216... -> 62.2
        let res23 = score_subject("en", 23.0, 37.0).unwrap();
        assert_eq!(res23.scaled_score, 62.2);
        assert_eq!(res23.grade.code, "satisfactory");
        // 10 closed -> 1000/37 = 27.02702... -> 27.0
        let res10 = score_subject("en", 10.0, 37.0).unwrap();
        assert_eq!(res10.scaled_score, 27.0);
        assert!(!res10.passed);
        assert_eq!(res10.grade.code, "college-min");
    }

    #[test]
    fn zero_negative_marking_clamps_negative_raw_to_zero() {
        let res = score_subject("math", -5.0, 32.0).unwrap();
        assert_eq!(res.raw_earned, 0.0);
        assert_eq!(res.scaled_score, 0.0);
        assert_eq!(res.pct, 0);
        assert!(!res.passed);
        assert_eq!(res.grade.code, "below");
    }

    #[test]
    fn excess_raw_earned_clamps_to_100() {
        let res = score_subject("ru", 55.0, 40.0).unwrap();
        assert_eq!(res.raw_earned, 40.0);
        assert_eq!(res.scaled_score, 100.0);
        assert_eq!(res.pct, 100);
    }

    #[test]
    fn grade_threshold_boundaries_10_40_65_85() {
        assert_eq!(classify_grade(0.0).code, "below");
        assert_eq!(classify_grade(9.9).code, "below");
        assert_eq!(classify_grade(10.0).code, "college-min");
        assert_eq!(classify_grade(39.9).code, "college-min");
        assert_eq!(classify_grade(40.0).code, "satisfactory");
        assert_eq!(classify_grade(64.9).code, "satisfactory");
        assert_eq!(classify_grade(65.0).code, "good");
        assert_eq!(classify_grade(84.9).code, "good");
        assert_eq!(classify_grade(85.0).code, "excellent");
        assert_eq!(classify_grade(100.0).code, "excellent");
    }

    #[test]
    fn subject_parsing_is_case_insensitive_and_trimmed() {
        let res = score_subject("  MATH ", 16.0, 32.0).unwrap();
        assert_eq!(res.subject, "math");
        assert_eq!(res.scaled_score, 50.0);
    }

    #[test]
    fn rejects_unknown_subject_and_non_finite_numbers() {
        assert!(score_subject("astrology", 10.0, 30.0).is_err());
        assert!(score_subject("math", f64::NAN, 32.0).is_err());
        assert!(score_subject("math", f64::INFINITY, 32.0).is_err());
        assert!(score_subject("math", 10.0, f64::NAN).is_err());
    }

    #[test]
    fn block_subjects_score_on_100_point_dim_scale() {
        for sid in [
            "physics",
            "chemistry",
            "biology",
            "history",
            "geography",
            "informatics",
        ] {
            let full = score_subject(sid, 33.0, 33.0).unwrap();
            assert_eq!(full.scaled_score, 100.0);
            assert_eq!(full.grade.code, "excellent");
            let half = score_subject(sid, 16.5, 33.0).unwrap();
            assert_eq!(half.scaled_score, 50.0);
            assert!(half.passed);
        }
    }

    #[test]
    fn defaults_to_official_raw_max_when_non_positive() {
        let res = score_subject("en", 37.0, 0.0).unwrap();
        assert_eq!(res.raw_max, 37.0);
        assert_eq!(res.scaled_score, 100.0);
        assert_eq!(res.formula, "round((100 / 37) * W, 1)");
    }

    #[test]
    fn supports_custom_partial_raw_max_proportionally() {
        let res = score_subject("math", 15.0, 20.0).unwrap();
        assert_eq!(res.raw_max, 20.0);
        assert_eq!(res.scaled_score, 75.0);
        assert_eq!(res.grade.code, "good");
    }

    #[test]
    fn command_score_exam_dim_uses_official_default_when_raw_max_omitted() {
        let res = score_exam_dim("ru".to_string(), 34.0, None).unwrap();
        assert_eq!(res.raw_max, 40.0);
        assert_eq!(res.scaled_score, 85.0);
        assert_eq!(res.grade.code, "excellent");
    }
}
