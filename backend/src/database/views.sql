CREATE MATERIALIZED VIEW IF NOT EXISTS user_dashboard_stats AS
SELECT
    u.user_id,
    u.display_name,
    COUNT(DISTINCT b.bin_id) AS total_bins,
    COUNT(DISTINCT be.id) AS total_events,
    SUM(be.weight_kg_total) AS total_weight_kg,
    SUM(be.hv_count) AS total_hv_count,
    SUM(be.lv_count) AS total_lv_count,
    SUM(be.org_count) AS total_org_count,
    AVG(ai.purity_score) AS avg_purity_score,
    SUM(rl.points_earned) AS total_points_earned
FROM
    users u
LEFT JOIN
    bins b ON u.user_id = b.user_id
LEFT JOIN
    bin_events be ON b.bin_id = be.bin_id
LEFT JOIN
    ai_insights ai ON be.id = ai.event_id
LEFT JOIN
    rewards_ledger rl ON u.user_id = rl.user_id
WHERE
    u.role = 'host'
GROUP BY
    u.user_id, u.display_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_dashboard_stats_user_id ON user_dashboard_stats(user_id);
