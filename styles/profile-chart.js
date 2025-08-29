// コースプロファイル（標高グラフ）表示用JavaScript

class ElevationProfileChart {
    constructor() {
        this.chart = null;
        this.chartContainer = document.getElementById('elevation-profile-chart');
    }

    async loadProfileData(mountainName) {
        try {
            // プロファイルデータの読み込み
            const profileDataPath = `profiles/${mountainName}/chart_data.json`;
            const response = await fetch(profileDataPath);
            
            if (!response.ok) {
                console.warn(`プロファイルデータが見つかりません: ${mountainName}`);
                this.showNoDataMessage();
                return null;
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('プロファイルデータの読み込みエラー:', error);
            this.showErrorMessage();
            return null;
        }
    }

    createChart(data, mountainName) {
        if (!data || !this.chartContainer) {
            return;
        }

        // Canvas要素を作成
        const canvas = document.createElement('canvas');
        canvas.id = 'profile-canvas';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        // 既存のコンテンツをクリア
        this.chartContainer.innerHTML = '';
        this.chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // Chart.js設定
        const config = {
            type: 'line',
            data: {
                datasets: [{
                    label: `${mountainName} 標高プロファイル`,
                    data: data.datasets[0].data,
                    borderColor: '#2c5aa0',
                    backgroundColor: 'rgba(44, 90, 160, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#ff6b35',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: '距離 (km)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '標高 (m)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `${mountainName} - コースプロファイル`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#2c5aa0'
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(44, 90, 160, 0.9)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#2c5aa0',
                        borderWidth: 1,
                        callbacks: {
                            title: function(context) {
                                const point = context[0];
                                return `距離: ${point.parsed.x.toFixed(1)}km`;
                            },
                            label: function(context) {
                                return `標高: ${context.parsed.y.toFixed(0)}m`;
                            },
                            afterLabel: function(context) {
                                // 主要地点の情報を表示
                                if (data.waypoints) {
                                    const distance = context.parsed.x;
                                    const waypoint = data.waypoints.find(wp => 
                                        Math.abs(wp.distance - distance) < 0.1
                                    );
                                    if (waypoint) {
                                        return [`地点: ${waypoint.name}`, `時刻: ${waypoint.time}`];
                                    }
                                }
                                return '';
                            }
                        }
                    }
                },
                onHover: (event, activeElements) => {
                    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                }
            }
        };

        // チャートを作成
        this.chart = new Chart(ctx, config);

        // 主要地点マーカーを追加
        this.addWaypointMarkers(data.waypoints);
    }

    addWaypointMarkers(waypoints) {
        if (!waypoints || !this.chart) return;

        // 主要地点データセットを追加
        const waypointData = waypoints.map(wp => ({
            x: wp.distance,
            y: wp.elevation
        }));

        this.chart.data.datasets.push({
            type: 'scatter',
            label: '主要地点',
            data: waypointData,
            backgroundColor: '#ff6b35',
            borderColor: '#ff6b35',
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false
        });

        this.chart.update();
    }

    showNoDataMessage() {
        if (this.chartContainer) {
            this.chartContainer.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-chart-line"></i>
                    <p class="mb-0">コースプロファイルデータを準備中です</p>
                </div>
            `;
        }
    }

    showErrorMessage() {
        if (this.chartContainer) {
            this.chartContainer.innerHTML = `
                <div class="alert alert-warning text-center">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p class="mb-0">コースプロファイルデータの読み込みに失敗しました</p>
                </div>
            `;
        }
    }

    async init(mountainName) {
        if (!mountainName || !this.chartContainer) {
            return;
        }

        console.log(`コースプロファイル初期化: ${mountainName}`);

        // データ読み込み
        const profileData = await this.loadProfileData(mountainName);
        
        if (profileData) {
            // チャート作成
            this.createChart(profileData, mountainName);
        }
    }
}

// インラインデータから直接グラフを表示する関数
window.initElevationProfileWithData = function(profileData, mountainName) {
    // Chart.jsが読み込まれているかチェック
    if (typeof Chart === 'undefined') {
        console.error('Chart.js が読み込まれていません');
        return;
    }

    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const profileChart = new ElevationProfileChart();
            profileChart.createChart(profileData, mountainName);
        });
    } else {
        const profileChart = new ElevationProfileChart();
        profileChart.createChart(profileData, mountainName);
    }
};

// 従来のfetch方式（HTTP/HTTPSサーバー環境用）
window.initElevationProfile = function(mountainName) {
    // Chart.jsが読み込まれているかチェック
    if (typeof Chart === 'undefined') {
        console.error('Chart.js が読み込まれていません');
        return;
    }

    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const profileChart = new ElevationProfileChart();
            profileChart.init(mountainName);
        });
    } else {
        const profileChart = new ElevationProfileChart();
        profileChart.init(mountainName);
    }
};

// 汎用初期化関数（山名をページから自動検出）
window.initElevationProfileAuto = function() {
    // ページタイトルから山名を推定
    const title = document.querySelector('h1')?.textContent || document.title;
    let mountainName = '';
    
    if (title.includes('奥穂高岳')) mountainName = '奥穂高岳';
    else if (title.includes('槍ヶ岳')) mountainName = '槍ヶ岳';
    else if (title.includes('立山') || title.includes('雄山')) mountainName = '立山';
    else if (title.includes('木曽駒ヶ岳')) mountainName = '木曽駒ヶ岳';
    else if (title.includes('北岳')) mountainName = '北岳';
    
    if (mountainName) {
        window.initElevationProfile(mountainName);
    }
};

// ページ読み込み完了時に自動初期化
document.addEventListener('DOMContentLoaded', function() {
    // Chart.jsの読み込み完了を待つ
    const checkChart = setInterval(() => {
        if (typeof Chart !== 'undefined') {
            clearInterval(checkChart);
            // インラインデータが存在する場合はそれを優先
            if (window.PROFILE_DATA) {
                const mountainName = document.querySelector('h1')?.textContent || 'unknown';
                const profileChart = new ElevationProfileChart();
                profileChart.createChart(window.PROFILE_DATA, mountainName);
            } else {
                window.initElevationProfileAuto();
            }
        }
    }, 100);
});