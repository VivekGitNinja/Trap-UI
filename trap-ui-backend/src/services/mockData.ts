export let mockReportList = [
    {
        id: 1,
        website_url: "https://example.com",
        trap_ui_score: 72,
        industry_tag: "AI SaaS",
        created_at: new Date().toISOString()
    }
];

export let mockReportDetails = [
    {
        id: 1,
        user_id: null,
        website_url: "https://example.com",
        trap_ui_score: 72,
        industry_tag: "AI SaaS",
        created_at: new Date().toISOString(),
        breakdown_json: {
            score: { final: 72, breakdown: { colorTrustIndex: 7, layoutEfficiency: 8, ctaOptimization: 6, conversionIndicators: 7, mobileResponsiveness: 8 } },
            layout: { type: "Centered Hero", confidence: 90 },
            density: { rating: "Balanced" },
            timingMs: 1200,
            cta: { count: 3, primary: "Get Started", placementScore: 7 },
            color: { palette: ["#ffffff", "#000000", "#3b82f6"] }
        }
    }
];

export function addMockReport(url: string, score: number, breakdown_json: any, industry_tag: string | null) {
    const nextId = mockReportList.length ? Math.max(...mockReportList.map(r => r.id)) + 1 : 1;
    const now = new Date().toISOString();

    // Add to list
    mockReportList.unshift({
        id: nextId,
        website_url: url,
        trap_ui_score: score,
        industry_tag: industry_tag || "Unknown",
        created_at: now
    });

    // Add to details
    mockReportDetails.unshift({
        id: nextId,
        user_id: null,
        website_url: url,
        trap_ui_score: score,
        industry_tag: industry_tag || "Unknown",
        created_at: now,
        breakdown_json
    });

    // Keep max 10
    if (mockReportList.length > 10) mockReportList.pop();
    if (mockReportDetails.length > 10) mockReportDetails.pop();
}
