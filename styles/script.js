// 日本アルプス登山情報サイト JavaScript

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeFilters();
    initializeTooltips();
    initializeImageGallery();
    
    // スムーススクロール
    initializeSmoothScroll();
    
    console.log('🏔️ 日本アルプス登山情報サイト初期化完了');
});

// 検索機能の初期化
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterMountains();
    });
}

// フィルター機能の初期化
function initializeFilters() {
    const areaFilter = document.getElementById('areaFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    
    if (areaFilter) {
        areaFilter.addEventListener('change', filterMountains);
    }
    
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterMountains);
    }
}

// 山のフィルタリング機能
function filterMountains() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const selectedArea = document.getElementById('areaFilter')?.value || '';
    const selectedDifficulty = document.getElementById('difficultyFilter')?.value || '';
    
    const mountainCards = document.querySelectorAll('.mountain-card');
    let visibleCount = 0;
    
    mountainCards.forEach(card => {
        const mountainName = card.dataset.name.toLowerCase();
        const mountainArea = card.dataset.area;
        const mountainDifficulty = card.dataset.difficulty;
        
        // 検索条件をチェック
        const matchesSearch = !searchTerm || mountainName.includes(searchTerm);
        const matchesArea = !selectedArea || mountainArea === selectedArea;
        const matchesDifficulty = !selectedDifficulty || mountainDifficulty === selectedDifficulty;
        
        if (matchesSearch && matchesArea && matchesDifficulty) {
            card.style.display = 'block';
            visibleCount++;
            
            // 検索語句をハイライト
            if (searchTerm) {
                highlightSearchTerm(card, searchTerm);
            } else {
                removeHighlights(card);
            }
        } else {
            card.style.display = 'none';
        }
    });
    
    // 結果数を表示
    updateResultCount(visibleCount);
}

// 検索語句のハイライト表示
function highlightSearchTerm(card, searchTerm) {
    const titleElement = card.querySelector('.card-title');
    if (!titleElement) return;
    
    const originalText = titleElement.textContent;
    const highlightedText = originalText.replace(
        new RegExp(`(${searchTerm})`, 'gi'),
        '<span class="search-highlight">$1</span>'
    );
    
    titleElement.innerHTML = highlightedText;
}

// ハイライトを除去
function removeHighlights(card) {
    const highlights = card.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

// フィルターのクリア
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('areaFilter').value = '';
    document.getElementById('difficultyFilter').value = '';
    
    // 全ての山を表示
    const mountainCards = document.querySelectorAll('.mountain-card');
    mountainCards.forEach(card => {
        card.style.display = 'block';
        removeHighlights(card);
    });
    
    updateResultCount(mountainCards.length);
}

// 検索結果数の更新
function updateResultCount(count) {
    // 既存の結果表示を削除
    const existingResult = document.getElementById('search-result-count');
    if (existingResult) {
        existingResult.remove();
    }
    
    // 新しい結果表示を追加
    const searchCard = document.querySelector('#search .card-body');
    if (searchCard && (document.getElementById('searchInput').value || 
                      document.getElementById('areaFilter').value || 
                      document.getElementById('difficultyFilter').value)) {
        const resultDiv = document.createElement('div');
        resultDiv.id = 'search-result-count';
        resultDiv.className = 'mt-3 text-muted';
        resultDiv.innerHTML = `<small>🔍 検索結果: <strong>${count}</strong>座の山</small>`;
        searchCard.appendChild(resultDiv);
    }
}

// ツールチップの初期化
function initializeTooltips() {
    // Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // カスタムツールチップ（難易度説明）
    addDifficultyTooltips();
}

// 難易度の説明ツールチップを追加
function addDifficultyTooltips() {
    const difficultyBadges = document.querySelectorAll('.badge');
    
    difficultyBadges.forEach(badge => {
        const difficulty = badge.textContent;
        let tooltip = '';
        
        switch(difficulty) {
            case '初級':
                tooltip = '登山経験が浅い方でも挑戦しやすいルート';
                break;
            case '中級':
                tooltip = '基本的な登山経験と体力が必要なルート';
                break;
            case '上級':
                tooltip = '十分な登山経験と高い体力・技術が必要なルート';
                break;
        }
        
        if (tooltip) {
            badge.setAttribute('data-bs-toggle', 'tooltip');
            badge.setAttribute('data-bs-placement', 'top');
            badge.setAttribute('title', tooltip);
            new bootstrap.Tooltip(badge);
        }
    });
}

// スムーススクロールの初期化
function initializeSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 山の統計情報を表示する関数
function showMountainStats() {
    const mountainCards = document.querySelectorAll('.mountain-card');
    const areas = {'北アルプス': 0, '中央アルプス': 0, '南アルプス': 0};
    const difficulties = {'初級': 0, '中級': 0, '上級': 0};
    
    mountainCards.forEach(card => {
        const area = card.dataset.area;
        const difficulty = card.dataset.difficulty;
        
        if (areas.hasOwnProperty(area)) {
            areas[area]++;
        }
        
        if (difficulties.hasOwnProperty(difficulty)) {
            difficulties[difficulty]++;
        }
    });
    
    console.log('📊 山域別統計:', areas);
    console.log('📊 難易度別統計:', difficulties);
    
    return {areas, difficulties};
}

// ページの印刷機能
function printPage() {
    window.print();
}

// シェア機能（Web Share API対応）
function sharePage(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title || document.title,
            url: url || window.location.href
        });
    } else {
        // フォールバック: URLをクリップボードにコピー
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('URLをクリップボードにコピーしました');
        });
    }
}

// 検索キーワードの提案機能
function suggestKeywords(input) {
    const keywords = [
        '奥穂高岳', '槍ヶ岳', '立山', '木曽駒ヶ岳', '北岳',
        '初級', '中級', '上級', '日帰り', '1泊2日',
        '北アルプス', '中央アルプス', '南アルプス'
    ];
    
    const value = input.toLowerCase();
    return keywords.filter(keyword => 
        keyword.toLowerCase().includes(value)
    );
}

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('JavaScript エラー:', e.error);
});

// パフォーマンス監視
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ ページ読み込み時間: ${loadTime}ms`);
    }
});


// 画像ギャラリー機能の初期化
function initializeImageGallery() {
    // 各山のカードに画像表示機能を追加
    const mountainCards = document.querySelectorAll('.mountain-card');
    
    mountainCards.forEach(card => {
        const mountainName = card.dataset.name;
        addImageGalleryToCard(card, mountainName);
    });
}

// コースプロファイルデータ
const COURSE_PROFILE_DATA = {
    '槍ヶ岳': {
        "datasets": [{"label": "槍ヶ岳 標高プロファイル", "data": [{"x": 0.0, "y": 1510.0}, {"x": 0.10500000000000001, "y": 1511.3128689300804}, {"x": 0.21000000000000002, "y": 1512.6180339887499}, {"x": 0.315, "y": 1513.9079809994792}, {"x": 0.42000000000000004, "y": 1515.175570504585}, {"x": 0.525, "y": 1516.414213562373}, {"x": 0.63, "y": 1517.6180339887499}, {"x": 0.735, "y": 1518.7820130483767}, {"x": 0.8400000000000001, "y": 1519.9021130325903}, {"x": 0.9450000000000001, "y": 1520.9753766811903}, {"x": 1.05, "y": 1522.0}, {"x": 1.1550000000000002, "y": 1522.9753766811903}, {"x": 1.26, "y": 1523.9021130325903}, {"x": 1.3650000000000002, "y": 1524.7820130483767}, {"x": 1.47, "y": 1525.6180339887499}, {"x": 1.5750000000000002, "y": 1526.414213562373}, {"x": 1.6800000000000002, "y": 1527.175570504585}, {"x": 1.785, "y": 1527.9079809994792}, {"x": 1.8900000000000001, "y": 1528.6180339887499}, {"x": 1.9949999999999999, "y": 1529.3128689300804}, {"x": 2.1, "y": 1530.0}, {"x": 2.1, "y": 1530.0}, {"x": 2.2181818181818183, "y": 1533.5724703977971}, {"x": 2.3363636363636364, "y": 1537.0764679069123}, {"x": 2.4545454545454546, "y": 1540.449066904881}, {"x": 2.5727272727272728, "y": 1543.6379868951547}, {"x": 2.690909090909091, "y": 1546.6058279620065}, {"x": 2.809090909090909, "y": 1549.333100689279}, {"x": 2.9272727272727272, "y": 1551.8198050769727}, {"x": 3.0454545454545454, "y": 1554.0854305412445}, {"x": 3.1636363636363636, "y": 1556.1673769978213}, {"x": 3.2818181818181817, "y": 1558.1179249432516}, {"x": 3.4, "y": 1560.0}, {"x": 3.4, "y": 1560.0}, {"x": 3.5052631578947366, "y": 1564.1454622785266}, {"x": 3.610526315789474, "y": 1568.2639862889123}, {"x": 3.7157894736842105, "y": 1572.3293685687486}, {"x": 3.8210526315789473, "y": 1576.3168552235063}, {"x": 3.9263157894736844, "y": 1580.2038171482495}, {"x": 4.031578947368421, "y": 1583.9703672906278}, {"x": 4.136842105263158, "y": 1587.599903117825}, {"x": 4.242105263157895, "y": 1591.079559490373}, {"x": 4.347368421052631, "y": 1594.400559589619}, {"x": 4.4526315789473685, "y": 1597.558454326461}, {"x": 4.557894736842106, "y": 1600.5532437008992}, {"x": 4.663157894736842, "y": 1603.3893768020355}, {"x": 4.768421052631579, "y": 1606.0756304485224}, {"x": 4.873684210526315, "y": 1608.6248697798283}, {"x": 4.9789473684210535, "y": 1611.0536973287697}, {"x": 5.08421052631579, "y": 1613.382000147696}, {"x": 5.189473684210527, "y": 1615.632407341544}, {"x": 5.294736842105263, "y": 1617.8296728048424}, {"x": 5.4, "y": 1620.0}, {"x": 5.4, "y": 1620.0}, {"x": 5.50909090909091, "y": 1648.6492940552994}, {"x": 5.618181818181818, "y": 1677.1595263647523}, {"x": 5.7272727272727275, "y": 1705.394466078636}, {"x": 5.836363636363637, "y": 1733.2234865105959}, {"x": 5.945454545454545, "y": 1760.5242243202827}, {"x": 6.054545454545455, "y": 1787.1850704780954}, {"x": 6.163636363636364, "y": 1813.1074423031694}, {"x": 6.272727272727273, "y": 1838.2077903224713}, {"x": 6.381818181818182, "y": 1862.4192990971324}, {"x": 6.490909090909091, "y": 1885.693247392103}, {"x": 6.6, "y": 1908.0}, {"x": 6.709090909090909, "y": 1929.3296110284666}, {"x": 6.818181818181818, "y": 1949.6920263698594}, {"x": 6.927272727272728, "y": 1969.1168812315623}, {"x": 7.036363636363636, "y": 1987.6528968486239}, {"x": 7.1454545454545455, "y": 2005.3668886599135}, {"x": 7.254545454545454, "y": 2022.3424061384646}, {"x": 7.363636363636363, "y": 2038.6780319651414}, {"x": 7.472727272727273, "y": 2054.485375169545}, {"x": 7.581818181818182, "y": 2069.8867990920253}, {"x": 7.690909090909091, "y": 2085.012930418936}, {"x": 7.8, "y": 2100.0}, {"x": 7.8, "y": 2100.0}, {"x": 7.916666666666666, "y": 2089.1666666666665}, {"x": 8.033333333333333, "y": 2079.0032063144113}, {"x": 8.15, "y": 2070.0}, {"x": 8.266666666666666, "y": 2062.3365396477443}, {"x": 8.383333333333333, "y": 2055.8333333333335}, {"x": 8.5, "y": 2050.0}, {"x": 8.5, "y": 2050.0}, {"x": 8.613333333333333, "y": 2134.8341006759892}, {"x": 8.726666666666667, "y": 2218.786787711686}, {"x": 8.84, "y": 2301.01516947237}, {"x": 8.953333333333333, "y": 2380.7517147379735}, {"x": 9.066666666666666, "y": 2457.337797500424}, {"x": 9.18, "y": 2530.2524820806298}, {"x": 9.293333333333333, "y": 2599.135290517389}, {"x": 9.406666666666666, "y": 2663.801957184056}, {"x": 9.52, "y": 2724.2524820806298}, {"x": 9.633333333333333, "y": 2780.671130833757}, {"x": 9.746666666666666, "y": 2833.4183814046405}, {"x": 9.86, "y": 2883.01516947237}, {"x": 9.973333333333333, "y": 2930.1201210450195}, {"x": 10.086666666666666, "y": 2975.500767342656}, {"x": 10.2, "y": 3020.0}, {"x": 10.2, "y": 3020.0}, {"x": 10.314285714285713, "y": 3049.7992826830236}, {"x": 10.428571428571429, "y": 3078.223589433774}, {"x": 10.542857142857143, "y": 3104.1702751663374}, {"x": 10.657142857142857, "y": 3127.0274180234805}, {"x": 10.77142857142857, "y": 3146.7950180052026}, {"x": 10.885714285714286, "y": 3164.0849969687383}, {"x": 11.0, "y": 3180.0}], "borderColor": "#2c5aa0", "backgroundColor": "rgba(44, 90, 160, 0.1)", "fill": true, "tension": 0.3, "pointRadius": 0, "pointHoverRadius": 6}],
        "waypoints": [{"name": "上高地BT", "distance": 0.0, "elevation": 1510, "time": "06:00"}, {"name": "明神池", "distance": 2.1, "elevation": 1530, "time": "07:30"}, {"name": "徳沢ロッヂ", "distance": 3.4, "elevation": 1560, "time": "08:30"}, {"name": "横尾山荘", "distance": 5.4, "elevation": 1620, "time": "09:30"}, {"name": "槍沢ロッヂ", "distance": 7.8, "elevation": 2100, "time": "12:00"}, {"name": "大曲", "distance": 8.5, "elevation": 2050, "time": "13:00"}, {"name": "槍ヶ岳山荘", "distance": 10.2, "elevation": 3020, "time": "15:30"}, {"name": "槍ヶ岳山頂", "distance": 11.0, "elevation": 3180, "time": "16:30"}]
    }
    // 他の山のデータは必要に応じて追加
};

// カードに画像検索ボタンとコースボタンを追加
function addImageGalleryToCard(card, mountainName) {
    const cardBody = card.querySelector('.card-body');
    if (!cardBody) return;
    
    // コースプロファイル実装済みの山リスト
    const mountainsWithProfile = [
        '西穂高岳',
        '立山（雄山）', 
        '槍ヶ岳',
        '木曽駒ヶ岳',
        '奥穂高岳',
        '北岳'
    ];
    
    // ボタンコンテナを作成
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mt-2';
    
    // 写真検索ボタンを作成
    const searchButton = document.createElement('button');
    searchButton.className = 'btn btn-outline-info btn-sm me-2';
    searchButton.textContent = '🔍 写真を検索';
    searchButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openGoogleImageSearch(`${mountainName} 登山 山頂 風景`);
    };
    
    buttonContainer.appendChild(searchButton);
    
    // コースプロファイルがある山の場合、コースボタンを追加
    if (mountainsWithProfile.includes(mountainName)) {
        const courseButton = document.createElement('button');
        courseButton.className = 'btn btn-outline-success btn-sm';
        courseButton.textContent = '📈 コースを見る';
        courseButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // コースプロファイルポップアップを表示
            showCourseProfileModal(mountainName);
        };
        
        buttonContainer.appendChild(courseButton);
    }
    
    // カードボディにボタンコンテナを追加
    cardBody.appendChild(buttonContainer);
}

// Google画像検索を新しいタブで開く
function openGoogleImageSearch(searchQuery) {
    const googleSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;
    window.open(googleSearchUrl, '_blank');
}

// コースプロファイルモーダルを表示
function showCourseProfileModal(mountainName) {
    // データが存在するかチェック
    const profileData = COURSE_PROFILE_DATA[mountainName];
    if (!profileData) {
        // データがない場合は個別ページに遷移（フォールバック）
        window.location.href = `${mountainName}.html`;
        return;
    }
    
    // モーダルタイトルを更新
    const modalTitle = document.getElementById('courseProfileModalLabel');
    modalTitle.textContent = `${mountainName} - コースプロファイル`;
    
    // チャートコンテナを取得
    const chartContainer = document.getElementById('modal-chart-container');
    
    // 既存のチャートを削除
    chartContainer.innerHTML = '';
    
    // 新しいcanvas要素を作成
    const canvas = document.createElement('canvas');
    canvas.id = 'modal-profile-canvas';
    chartContainer.appendChild(canvas);
    
    // Chart.jsでグラフを作成
    const ctx = canvas.getContext('2d');
    
    const config = {
        type: 'line',
        data: {
            datasets: [{
                label: `${mountainName} 標高プロファイル`,
                data: profileData.datasets[0].data,
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
                            if (profileData.waypoints) {
                                const distance = context.parsed.x;
                                const waypoint = profileData.waypoints.find(wp => 
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
            }
        }
    };
    
    // チャートを作成
    const chart = new Chart(ctx, config);
    
    // 主要地点マーカーを追加
    if (profileData.waypoints) {
        const waypointData = profileData.waypoints.map(wp => ({
            x: wp.distance,
            y: wp.elevation
        }));

        chart.data.datasets.push({
            type: 'scatter',
            label: '主要地点',
            data: waypointData,
            backgroundColor: '#ff6b35',
            borderColor: '#ff6b35',
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false
        });

        chart.update();
    }
    
    // モーダルを表示
    const modal = new bootstrap.Modal(document.getElementById('courseProfileModal'));
    modal.show();
}



// サービスワーカー登録（オフライン対応）
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('🔧 Service Worker 登録成功');
        })
        .catch(error => {
            console.log('🔧 Service Worker 登録失敗:', error);
        });
}