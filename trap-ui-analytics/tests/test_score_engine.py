from app.services.score_engine import compute_breakdown, trap_ui_score


def test_trap_ui_score_formula_range():
    breakdown = compute_breakdown(
        color_contrast=4.5,
        layout_type="Split Hero",
        cta_count=4,
        cta_placement=8.5,
        density_rating="Medium",
    )
    score = trap_ui_score(breakdown)

    assert 0 <= score <= 100
    assert round(score, 2) == score
    assert breakdown["layoutEfficiency"] >= 0
    assert breakdown["ctaOptimization"] >= 0
