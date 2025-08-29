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

// 全41山のコースプロファイルデータ


// コースプロファイル表示関数（修正版）


// 全山のコースプロファイルデータ（自動生成）
const ALL_COURSE_PROFILE_DATA = {
  "富士山": {
    "mountain": "富士山",
    "datasets": [
      {
        "label": "富士山 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1776.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1790.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1805.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1820.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1835.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1850.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1865.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1879.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1894.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1909.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1924.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1939.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1954.1538461538462
          },
          {
            "x": 1.4,
            "y": 1969.0
          },
          {
            "x": 1.4,
            "y": 1969.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1986.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 2004.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 2022.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 2040.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 2058.6428571428573
          },
          {
            "x": 2.0428571428571427,
            "y": 2076.5714285714284
          },
          {
            "x": 2.15,
            "y": 2094.5
          },
          {
            "x": 2.257142857142857,
            "y": 2112.4285714285716
          },
          {
            "x": 2.3642857142857143,
            "y": 2130.3571428571427
          },
          {
            "x": 2.4714285714285715,
            "y": 2148.285714285714
          },
          {
            "x": 2.5785714285714283,
            "y": 2166.214285714286
          },
          {
            "x": 2.6857142857142855,
            "y": 2184.1428571428573
          },
          {
            "x": 2.7928571428571427,
            "y": 2202.0714285714284
          },
          {
            "x": 2.9,
            "y": 2220.0
          },
          {
            "x": 2.9,
            "y": 2220.0
          },
          {
            "x": 3.0076923076923077,
            "y": 2241.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 2262.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 2284.3846153846152
          },
          {
            "x": 3.3307692307692305,
            "y": 2305.846153846154
          },
          {
            "x": 3.4384615384615382,
            "y": 2327.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 2348.769230769231
          },
          {
            "x": 3.6538461538461537,
            "y": 2370.230769230769
          },
          {
            "x": 3.7615384615384615,
            "y": 2391.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 2413.153846153846
          },
          {
            "x": 3.976923076923077,
            "y": 2434.6153846153848
          },
          {
            "x": 4.084615384615384,
            "y": 2456.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 2477.5384615384614
          },
          {
            "x": 4.3,
            "y": 2499.0
          },
          {
            "x": 4.3,
            "y": 2499.0
          },
          {
            "x": 4.407692307692307,
            "y": 2521.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 2544.846153846154
          },
          {
            "x": 4.623076923076923,
            "y": 2567.769230769231
          },
          {
            "x": 4.730769230769231,
            "y": 2590.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 2613.6153846153848
          },
          {
            "x": 4.946153846153846,
            "y": 2636.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 2659.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 2682.3846153846152
          },
          {
            "x": 5.269230769230769,
            "y": 2705.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2728.230769230769
          },
          {
            "x": 5.484615384615385,
            "y": 2751.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2774.076923076923
          },
          {
            "x": 5.7,
            "y": 2797.0
          },
          {
            "x": 5.7,
            "y": 2797.0
          },
          {
            "x": 5.816666666666666,
            "y": 2823.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2849.3333333333335
          },
          {
            "x": 6.05,
            "y": 2875.5
          },
          {
            "x": 6.166666666666667,
            "y": 2901.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2927.8333333333335
          },
          {
            "x": 6.4,
            "y": 2954.0
          },
          {
            "x": 6.516666666666667,
            "y": 2980.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 3006.3333333333335
          },
          {
            "x": 6.75,
            "y": 3032.5
          },
          {
            "x": 6.866666666666666,
            "y": 3058.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 3084.8333333333335
          },
          {
            "x": 7.1,
            "y": 3111.0
          },
          {
            "x": 7.1,
            "y": 3111.0
          },
          {
            "x": 7.207142857142856,
            "y": 3134.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 3157.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 3181.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 3204.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 3227.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 3251.1428571428573
          },
          {
            "x": 7.85,
            "y": 3274.5
          },
          {
            "x": 7.957142857142856,
            "y": 3297.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 3321.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 3344.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 3367.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 3391.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 3414.6428571428573
          },
          {
            "x": 8.6,
            "y": 3438.0
          },
          {
            "x": 8.6,
            "y": 3438.0
          },
          {
            "x": 8.707692307692307,
            "y": 3464.0
          },
          {
            "x": 8.815384615384614,
            "y": 3490.0
          },
          {
            "x": 8.923076923076923,
            "y": 3516.0
          },
          {
            "x": 9.03076923076923,
            "y": 3542.0
          },
          {
            "x": 9.138461538461538,
            "y": 3568.0
          },
          {
            "x": 9.246153846153845,
            "y": 3594.0
          },
          {
            "x": 9.353846153846154,
            "y": 3620.0
          },
          {
            "x": 9.461538461538462,
            "y": 3646.0
          },
          {
            "x": 9.569230769230769,
            "y": 3672.0
          },
          {
            "x": 9.676923076923076,
            "y": 3698.0
          },
          {
            "x": 9.784615384615385,
            "y": 3724.0
          },
          {
            "x": 9.892307692307693,
            "y": 3750.0
          },
          {
            "x": 10.0,
            "y": 3776.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1776,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1969,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 2220,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 2499,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2797,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 3111,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 3438,
        "time": "17:56"
      },
      {
        "name": "富士山山頂",
        "distance": 10.0,
        "elevation": 3776,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1776,
      "summit_elevation": 3776
    }
  },
  "北岳": {
    "mountain": "北岳",
    "datasets": [
      {
        "label": "北岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1193.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1207.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1222.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1237.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1252.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1267.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1282.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1296.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1311.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1326.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1341.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1356.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1371.1538461538462
          },
          {
            "x": 1.4,
            "y": 1386.0
          },
          {
            "x": 1.4,
            "y": 1386.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1403.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1421.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1439.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1457.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1475.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1493.5714285714287
          },
          {
            "x": 2.15,
            "y": 1511.5
          },
          {
            "x": 2.257142857142857,
            "y": 1529.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1547.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1565.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1583.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1601.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1619.0714285714287
          },
          {
            "x": 2.9,
            "y": 1637.0
          },
          {
            "x": 2.9,
            "y": 1637.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1658.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1679.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1701.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1722.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1744.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1765.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1787.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1808.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1830.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1851.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1873.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1894.5384615384614
          },
          {
            "x": 4.3,
            "y": 1916.0
          },
          {
            "x": 4.3,
            "y": 1916.0
          },
          {
            "x": 4.407692307692307,
            "y": 1938.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1961.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1984.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 2007.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 2030.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 2053.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 2076.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 2099.3846153846152
          },
          {
            "x": 5.269230769230769,
            "y": 2122.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2145.230769230769
          },
          {
            "x": 5.484615384615385,
            "y": 2168.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2191.076923076923
          },
          {
            "x": 5.7,
            "y": 2214.0
          },
          {
            "x": 5.7,
            "y": 2214.0
          },
          {
            "x": 5.816666666666666,
            "y": 2240.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2266.3333333333335
          },
          {
            "x": 6.05,
            "y": 2292.5
          },
          {
            "x": 6.166666666666667,
            "y": 2318.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2344.8333333333335
          },
          {
            "x": 6.4,
            "y": 2371.0
          },
          {
            "x": 6.516666666666667,
            "y": 2397.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2423.3333333333335
          },
          {
            "x": 6.75,
            "y": 2449.5
          },
          {
            "x": 6.866666666666666,
            "y": 2475.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2501.8333333333335
          },
          {
            "x": 7.1,
            "y": 2528.0
          },
          {
            "x": 7.1,
            "y": 2528.0
          },
          {
            "x": 7.207142857142856,
            "y": 2551.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2574.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2598.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2621.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2644.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2668.1428571428573
          },
          {
            "x": 7.85,
            "y": 2691.5
          },
          {
            "x": 7.957142857142856,
            "y": 2714.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2738.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2761.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2784.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2808.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2831.6428571428573
          },
          {
            "x": 8.6,
            "y": 2855.0
          },
          {
            "x": 8.6,
            "y": 2855.0
          },
          {
            "x": 8.707692307692307,
            "y": 2881.0
          },
          {
            "x": 8.815384615384614,
            "y": 2907.0
          },
          {
            "x": 8.923076923076923,
            "y": 2933.0
          },
          {
            "x": 9.03076923076923,
            "y": 2959.0
          },
          {
            "x": 9.138461538461538,
            "y": 2985.0
          },
          {
            "x": 9.246153846153845,
            "y": 3011.0
          },
          {
            "x": 9.353846153846154,
            "y": 3037.0
          },
          {
            "x": 9.461538461538462,
            "y": 3063.0
          },
          {
            "x": 9.569230769230769,
            "y": 3089.0
          },
          {
            "x": 9.676923076923076,
            "y": 3115.0
          },
          {
            "x": 9.784615384615385,
            "y": 3141.0
          },
          {
            "x": 9.892307692307693,
            "y": 3167.0
          },
          {
            "x": 10.0,
            "y": 3193.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1193,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1386,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1637,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1916,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2214,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2528,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2855,
        "time": "17:56"
      },
      {
        "name": "北岳山頂",
        "distance": 10.0,
        "elevation": 3193,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1193,
      "summit_elevation": 3193
    }
  },
  "奥穂高岳": {
    "mountain": "奥穂高岳",
    "datasets": [
      {
        "label": "奥穂高岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1190.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1204.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1219.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1234.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1249.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1264.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1279.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1293.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1308.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1323.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1338.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1353.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1368.1538461538462
          },
          {
            "x": 1.4,
            "y": 1383.0
          },
          {
            "x": 1.4,
            "y": 1383.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1400.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1418.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1436.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1454.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1472.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1490.5714285714287
          },
          {
            "x": 2.15,
            "y": 1508.5
          },
          {
            "x": 2.257142857142857,
            "y": 1526.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1544.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1562.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1580.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1598.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1616.0714285714287
          },
          {
            "x": 2.9,
            "y": 1634.0
          },
          {
            "x": 2.9,
            "y": 1634.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1655.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1676.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1698.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1719.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1741.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1762.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1784.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1805.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1827.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1848.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1870.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1891.5384615384614
          },
          {
            "x": 4.3,
            "y": 1913.0
          },
          {
            "x": 4.3,
            "y": 1913.0
          },
          {
            "x": 4.407692307692307,
            "y": 1935.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1958.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1981.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 2004.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 2027.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 2050.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 2073.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 2096.3846153846152
          },
          {
            "x": 5.269230769230769,
            "y": 2119.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2142.230769230769
          },
          {
            "x": 5.484615384615385,
            "y": 2165.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2188.076923076923
          },
          {
            "x": 5.7,
            "y": 2211.0
          },
          {
            "x": 5.7,
            "y": 2211.0
          },
          {
            "x": 5.816666666666666,
            "y": 2237.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2263.3333333333335
          },
          {
            "x": 6.05,
            "y": 2289.5
          },
          {
            "x": 6.166666666666667,
            "y": 2315.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2341.8333333333335
          },
          {
            "x": 6.4,
            "y": 2368.0
          },
          {
            "x": 6.516666666666667,
            "y": 2394.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2420.3333333333335
          },
          {
            "x": 6.75,
            "y": 2446.5
          },
          {
            "x": 6.866666666666666,
            "y": 2472.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2498.8333333333335
          },
          {
            "x": 7.1,
            "y": 2525.0
          },
          {
            "x": 7.1,
            "y": 2525.0
          },
          {
            "x": 7.207142857142856,
            "y": 2548.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2571.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2595.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2618.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2641.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2665.1428571428573
          },
          {
            "x": 7.85,
            "y": 2688.5
          },
          {
            "x": 7.957142857142856,
            "y": 2711.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2735.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2758.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2781.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2805.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2828.6428571428573
          },
          {
            "x": 8.6,
            "y": 2852.0
          },
          {
            "x": 8.6,
            "y": 2852.0
          },
          {
            "x": 8.707692307692307,
            "y": 2878.0
          },
          {
            "x": 8.815384615384614,
            "y": 2904.0
          },
          {
            "x": 8.923076923076923,
            "y": 2930.0
          },
          {
            "x": 9.03076923076923,
            "y": 2956.0
          },
          {
            "x": 9.138461538461538,
            "y": 2982.0
          },
          {
            "x": 9.246153846153845,
            "y": 3008.0
          },
          {
            "x": 9.353846153846154,
            "y": 3034.0
          },
          {
            "x": 9.461538461538462,
            "y": 3060.0
          },
          {
            "x": 9.569230769230769,
            "y": 3086.0
          },
          {
            "x": 9.676923076923076,
            "y": 3112.0
          },
          {
            "x": 9.784615384615385,
            "y": 3138.0
          },
          {
            "x": 9.892307692307693,
            "y": 3164.0
          },
          {
            "x": 10.0,
            "y": 3190.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1190,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1383,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1634,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1913,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2211,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2525,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2852,
        "time": "17:56"
      },
      {
        "name": "奥穂高岳山頂",
        "distance": 10.0,
        "elevation": 3190,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1190,
      "summit_elevation": 3190
    }
  },
  "間ノ岳": {
    "mountain": "間ノ岳",
    "datasets": [
      {
        "label": "間ノ岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1190.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1204.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1219.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1234.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1249.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1264.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1279.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1293.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1308.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1323.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1338.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1353.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1368.1538461538462
          },
          {
            "x": 1.4,
            "y": 1383.0
          },
          {
            "x": 1.4,
            "y": 1383.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1400.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1418.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1436.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1454.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1472.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1490.5714285714287
          },
          {
            "x": 2.15,
            "y": 1508.5
          },
          {
            "x": 2.257142857142857,
            "y": 1526.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1544.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1562.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1580.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1598.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1616.0714285714287
          },
          {
            "x": 2.9,
            "y": 1634.0
          },
          {
            "x": 2.9,
            "y": 1634.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1655.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1676.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1698.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1719.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1741.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1762.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1784.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1805.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1827.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1848.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1870.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1891.5384615384614
          },
          {
            "x": 4.3,
            "y": 1913.0
          },
          {
            "x": 4.3,
            "y": 1913.0
          },
          {
            "x": 4.407692307692307,
            "y": 1935.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1958.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1981.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 2004.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 2027.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 2050.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 2073.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 2096.3846153846152
          },
          {
            "x": 5.269230769230769,
            "y": 2119.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2142.230769230769
          },
          {
            "x": 5.484615384615385,
            "y": 2165.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2188.076923076923
          },
          {
            "x": 5.7,
            "y": 2211.0
          },
          {
            "x": 5.7,
            "y": 2211.0
          },
          {
            "x": 5.816666666666666,
            "y": 2237.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2263.3333333333335
          },
          {
            "x": 6.05,
            "y": 2289.5
          },
          {
            "x": 6.166666666666667,
            "y": 2315.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2341.8333333333335
          },
          {
            "x": 6.4,
            "y": 2368.0
          },
          {
            "x": 6.516666666666667,
            "y": 2394.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2420.3333333333335
          },
          {
            "x": 6.75,
            "y": 2446.5
          },
          {
            "x": 6.866666666666666,
            "y": 2472.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2498.8333333333335
          },
          {
            "x": 7.1,
            "y": 2525.0
          },
          {
            "x": 7.1,
            "y": 2525.0
          },
          {
            "x": 7.207142857142856,
            "y": 2548.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2571.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2595.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2618.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2641.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2665.1428571428573
          },
          {
            "x": 7.85,
            "y": 2688.5
          },
          {
            "x": 7.957142857142856,
            "y": 2711.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2735.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2758.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2781.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2805.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2828.6428571428573
          },
          {
            "x": 8.6,
            "y": 2852.0
          },
          {
            "x": 8.6,
            "y": 2852.0
          },
          {
            "x": 8.707692307692307,
            "y": 2878.0
          },
          {
            "x": 8.815384615384614,
            "y": 2904.0
          },
          {
            "x": 8.923076923076923,
            "y": 2930.0
          },
          {
            "x": 9.03076923076923,
            "y": 2956.0
          },
          {
            "x": 9.138461538461538,
            "y": 2982.0
          },
          {
            "x": 9.246153846153845,
            "y": 3008.0
          },
          {
            "x": 9.353846153846154,
            "y": 3034.0
          },
          {
            "x": 9.461538461538462,
            "y": 3060.0
          },
          {
            "x": 9.569230769230769,
            "y": 3086.0
          },
          {
            "x": 9.676923076923076,
            "y": 3112.0
          },
          {
            "x": 9.784615384615385,
            "y": 3138.0
          },
          {
            "x": 9.892307692307693,
            "y": 3164.0
          },
          {
            "x": 10.0,
            "y": 3190.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1190,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1383,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1634,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1913,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2211,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2525,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2852,
        "time": "17:56"
      },
      {
        "name": "間ノ岳山頂",
        "distance": 10.0,
        "elevation": 3190,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1190,
      "summit_elevation": 3190
    }
  },
  "槍ヶ岳": {
    "mountain": "槍ヶ岳",
    "datasets": [
      {
        "label": "槍ヶ岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1180.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1194.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1209.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1224.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1239.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1254.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1269.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1283.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1298.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1313.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1328.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1343.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1358.1538461538462
          },
          {
            "x": 1.4,
            "y": 1373.0
          },
          {
            "x": 1.4,
            "y": 1373.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1390.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1408.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1426.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1444.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1462.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1480.5714285714287
          },
          {
            "x": 2.15,
            "y": 1498.5
          },
          {
            "x": 2.257142857142857,
            "y": 1516.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1534.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1552.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1570.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1588.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1606.0714285714287
          },
          {
            "x": 2.9,
            "y": 1624.0
          },
          {
            "x": 2.9,
            "y": 1624.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1645.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1666.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1688.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1709.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1731.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1752.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1774.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1795.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1817.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1838.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1860.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1881.5384615384614
          },
          {
            "x": 4.3,
            "y": 1903.0
          },
          {
            "x": 4.3,
            "y": 1903.0
          },
          {
            "x": 4.407692307692307,
            "y": 1925.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1948.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1971.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1994.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 2017.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 2040.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 2063.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 2086.3846153846152
          },
          {
            "x": 5.269230769230769,
            "y": 2109.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2132.230769230769
          },
          {
            "x": 5.484615384615385,
            "y": 2155.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2178.076923076923
          },
          {
            "x": 5.7,
            "y": 2201.0
          },
          {
            "x": 5.7,
            "y": 2201.0
          },
          {
            "x": 5.816666666666666,
            "y": 2227.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2253.3333333333335
          },
          {
            "x": 6.05,
            "y": 2279.5
          },
          {
            "x": 6.166666666666667,
            "y": 2305.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2331.8333333333335
          },
          {
            "x": 6.4,
            "y": 2358.0
          },
          {
            "x": 6.516666666666667,
            "y": 2384.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2410.3333333333335
          },
          {
            "x": 6.75,
            "y": 2436.5
          },
          {
            "x": 6.866666666666666,
            "y": 2462.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2488.8333333333335
          },
          {
            "x": 7.1,
            "y": 2515.0
          },
          {
            "x": 7.1,
            "y": 2515.0
          },
          {
            "x": 7.207142857142856,
            "y": 2538.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2561.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2585.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2608.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2631.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2655.1428571428573
          },
          {
            "x": 7.85,
            "y": 2678.5
          },
          {
            "x": 7.957142857142856,
            "y": 2701.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2725.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2748.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2771.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2795.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2818.6428571428573
          },
          {
            "x": 8.6,
            "y": 2842.0
          },
          {
            "x": 8.6,
            "y": 2842.0
          },
          {
            "x": 8.707692307692307,
            "y": 2868.0
          },
          {
            "x": 8.815384615384614,
            "y": 2894.0
          },
          {
            "x": 8.923076923076923,
            "y": 2920.0
          },
          {
            "x": 9.03076923076923,
            "y": 2946.0
          },
          {
            "x": 9.138461538461538,
            "y": 2972.0
          },
          {
            "x": 9.246153846153845,
            "y": 2998.0
          },
          {
            "x": 9.353846153846154,
            "y": 3024.0
          },
          {
            "x": 9.461538461538462,
            "y": 3050.0
          },
          {
            "x": 9.569230769230769,
            "y": 3076.0
          },
          {
            "x": 9.676923076923076,
            "y": 3102.0
          },
          {
            "x": 9.784615384615385,
            "y": 3128.0
          },
          {
            "x": 9.892307692307693,
            "y": 3154.0
          },
          {
            "x": 10.0,
            "y": 3180.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1180,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1373,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1624,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1903,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2201,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2515,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2842,
        "time": "17:56"
      },
      {
        "name": "槍ヶ岳山頂",
        "distance": 10.0,
        "elevation": 3180,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1180,
      "summit_elevation": 3180
    }
  },
  "悪沢岳": {
    "mountain": "悪沢岳",
    "datasets": [
      {
        "label": "悪沢岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1141.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1155.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1170.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1185.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1200.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1215.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1230.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1244.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1259.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1274.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1289.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1304.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1319.1538461538462
          },
          {
            "x": 1.4,
            "y": 1334.0
          },
          {
            "x": 1.4,
            "y": 1334.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1351.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1369.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1387.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1405.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1423.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1441.5714285714287
          },
          {
            "x": 2.15,
            "y": 1459.5
          },
          {
            "x": 2.257142857142857,
            "y": 1477.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1495.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1513.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1531.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1549.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1567.0714285714287
          },
          {
            "x": 2.9,
            "y": 1585.0
          },
          {
            "x": 2.9,
            "y": 1585.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1606.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1627.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1649.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1670.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1692.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1713.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1735.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1756.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1778.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1799.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1821.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1842.5384615384614
          },
          {
            "x": 4.3,
            "y": 1864.0
          },
          {
            "x": 4.3,
            "y": 1864.0
          },
          {
            "x": 4.407692307692307,
            "y": 1886.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1909.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1932.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1955.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1978.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 2001.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 2024.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 2047.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 2070.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2093.230769230769
          },
          {
            "x": 5.484615384615385,
            "y": 2116.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2139.076923076923
          },
          {
            "x": 5.7,
            "y": 2162.0
          },
          {
            "x": 5.7,
            "y": 2162.0
          },
          {
            "x": 5.816666666666666,
            "y": 2188.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2214.3333333333335
          },
          {
            "x": 6.05,
            "y": 2240.5
          },
          {
            "x": 6.166666666666667,
            "y": 2266.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2292.8333333333335
          },
          {
            "x": 6.4,
            "y": 2319.0
          },
          {
            "x": 6.516666666666667,
            "y": 2345.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2371.3333333333335
          },
          {
            "x": 6.75,
            "y": 2397.5
          },
          {
            "x": 6.866666666666666,
            "y": 2423.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2449.8333333333335
          },
          {
            "x": 7.1,
            "y": 2476.0
          },
          {
            "x": 7.1,
            "y": 2476.0
          },
          {
            "x": 7.207142857142856,
            "y": 2499.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2522.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2546.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2569.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2592.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2616.1428571428573
          },
          {
            "x": 7.85,
            "y": 2639.5
          },
          {
            "x": 7.957142857142856,
            "y": 2662.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2686.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2709.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2732.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2756.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2779.6428571428573
          },
          {
            "x": 8.6,
            "y": 2803.0
          },
          {
            "x": 8.6,
            "y": 2803.0
          },
          {
            "x": 8.707692307692307,
            "y": 2829.0
          },
          {
            "x": 8.815384615384614,
            "y": 2855.0
          },
          {
            "x": 8.923076923076923,
            "y": 2881.0
          },
          {
            "x": 9.03076923076923,
            "y": 2907.0
          },
          {
            "x": 9.138461538461538,
            "y": 2933.0
          },
          {
            "x": 9.246153846153845,
            "y": 2959.0
          },
          {
            "x": 9.353846153846154,
            "y": 2985.0
          },
          {
            "x": 9.461538461538462,
            "y": 3011.0
          },
          {
            "x": 9.569230769230769,
            "y": 3037.0
          },
          {
            "x": 9.676923076923076,
            "y": 3063.0
          },
          {
            "x": 9.784615384615385,
            "y": 3089.0
          },
          {
            "x": 9.892307692307693,
            "y": 3115.0
          },
          {
            "x": 10.0,
            "y": 3141.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1141,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1334,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1585,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1864,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2162,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2476,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2803,
        "time": "17:56"
      },
      {
        "name": "悪沢岳山頂",
        "distance": 10.0,
        "elevation": 3141,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1141,
      "summit_elevation": 3141
    }
  },
  "赤石岳": {
    "mountain": "赤石岳",
    "datasets": [
      {
        "label": "赤石岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1121.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1135.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1150.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1165.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1180.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1195.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1210.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1224.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1239.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1254.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1269.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1284.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1299.1538461538462
          },
          {
            "x": 1.4,
            "y": 1314.0
          },
          {
            "x": 1.4,
            "y": 1314.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1331.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1349.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1367.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1385.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1403.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1421.5714285714287
          },
          {
            "x": 2.15,
            "y": 1439.5
          },
          {
            "x": 2.257142857142857,
            "y": 1457.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1475.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1493.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1511.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1529.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1547.0714285714287
          },
          {
            "x": 2.9,
            "y": 1565.0
          },
          {
            "x": 2.9,
            "y": 1565.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1586.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1607.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1629.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1650.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1672.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1693.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1715.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1736.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1758.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1779.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1801.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1822.5384615384614
          },
          {
            "x": 4.3,
            "y": 1844.0
          },
          {
            "x": 4.3,
            "y": 1844.0
          },
          {
            "x": 4.407692307692307,
            "y": 1866.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1889.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1912.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1935.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1958.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1981.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 2004.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 2027.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 2050.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2073.230769230769
          },
          {
            "x": 5.484615384615385,
            "y": 2096.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2119.076923076923
          },
          {
            "x": 5.7,
            "y": 2142.0
          },
          {
            "x": 5.7,
            "y": 2142.0
          },
          {
            "x": 5.816666666666666,
            "y": 2168.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2194.3333333333335
          },
          {
            "x": 6.05,
            "y": 2220.5
          },
          {
            "x": 6.166666666666667,
            "y": 2246.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2272.8333333333335
          },
          {
            "x": 6.4,
            "y": 2299.0
          },
          {
            "x": 6.516666666666667,
            "y": 2325.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2351.3333333333335
          },
          {
            "x": 6.75,
            "y": 2377.5
          },
          {
            "x": 6.866666666666666,
            "y": 2403.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2429.8333333333335
          },
          {
            "x": 7.1,
            "y": 2456.0
          },
          {
            "x": 7.1,
            "y": 2456.0
          },
          {
            "x": 7.207142857142856,
            "y": 2479.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2502.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2526.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2549.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2572.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2596.1428571428573
          },
          {
            "x": 7.85,
            "y": 2619.5
          },
          {
            "x": 7.957142857142856,
            "y": 2642.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2666.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2689.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2712.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2736.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2759.6428571428573
          },
          {
            "x": 8.6,
            "y": 2783.0
          },
          {
            "x": 8.6,
            "y": 2783.0
          },
          {
            "x": 8.707692307692307,
            "y": 2809.0
          },
          {
            "x": 8.815384615384614,
            "y": 2835.0
          },
          {
            "x": 8.923076923076923,
            "y": 2861.0
          },
          {
            "x": 9.03076923076923,
            "y": 2887.0
          },
          {
            "x": 9.138461538461538,
            "y": 2913.0
          },
          {
            "x": 9.246153846153845,
            "y": 2939.0
          },
          {
            "x": 9.353846153846154,
            "y": 2965.0
          },
          {
            "x": 9.461538461538462,
            "y": 2991.0
          },
          {
            "x": 9.569230769230769,
            "y": 3017.0
          },
          {
            "x": 9.676923076923076,
            "y": 3043.0
          },
          {
            "x": 9.784615384615385,
            "y": 3069.0
          },
          {
            "x": 9.892307692307693,
            "y": 3095.0
          },
          {
            "x": 10.0,
            "y": 3121.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1121,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1314,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1565,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1844,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2142,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2456,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2783,
        "time": "17:56"
      },
      {
        "name": "赤石岳山頂",
        "distance": 10.0,
        "elevation": 3121,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1121,
      "summit_elevation": 3121
    }
  },
  "涸沢岳": {
    "mountain": "涸沢岳",
    "datasets": [
      {
        "label": "涸沢岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1110.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1124.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1139.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1154.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1169.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1184.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1199.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1213.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1228.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1243.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1258.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1273.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1288.1538461538462
          },
          {
            "x": 1.4,
            "y": 1303.0
          },
          {
            "x": 1.4,
            "y": 1303.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1320.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1338.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1356.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1374.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1392.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1410.5714285714287
          },
          {
            "x": 2.15,
            "y": 1428.5
          },
          {
            "x": 2.257142857142857,
            "y": 1446.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1464.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1482.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1500.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1518.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1536.0714285714287
          },
          {
            "x": 2.9,
            "y": 1554.0
          },
          {
            "x": 2.9,
            "y": 1554.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1575.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1596.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1618.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1639.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1661.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1682.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1704.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1725.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1747.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1768.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1790.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1811.5384615384614
          },
          {
            "x": 4.3,
            "y": 1833.0
          },
          {
            "x": 4.3,
            "y": 1833.0
          },
          {
            "x": 4.407692307692307,
            "y": 1855.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1878.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1901.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1924.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1947.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1970.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1993.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 2016.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 2039.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2062.230769230769
          },
          {
            "x": 5.484615384615385,
            "y": 2085.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2108.076923076923
          },
          {
            "x": 5.7,
            "y": 2131.0
          },
          {
            "x": 5.7,
            "y": 2131.0
          },
          {
            "x": 5.816666666666666,
            "y": 2157.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2183.3333333333335
          },
          {
            "x": 6.05,
            "y": 2209.5
          },
          {
            "x": 6.166666666666667,
            "y": 2235.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2261.8333333333335
          },
          {
            "x": 6.4,
            "y": 2288.0
          },
          {
            "x": 6.516666666666667,
            "y": 2314.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2340.3333333333335
          },
          {
            "x": 6.75,
            "y": 2366.5
          },
          {
            "x": 6.866666666666666,
            "y": 2392.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2418.8333333333335
          },
          {
            "x": 7.1,
            "y": 2445.0
          },
          {
            "x": 7.1,
            "y": 2445.0
          },
          {
            "x": 7.207142857142856,
            "y": 2468.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2491.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2515.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2538.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2561.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2585.1428571428573
          },
          {
            "x": 7.85,
            "y": 2608.5
          },
          {
            "x": 7.957142857142856,
            "y": 2631.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2655.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2678.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2701.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2725.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2748.6428571428573
          },
          {
            "x": 8.6,
            "y": 2772.0
          },
          {
            "x": 8.6,
            "y": 2772.0
          },
          {
            "x": 8.707692307692307,
            "y": 2798.0
          },
          {
            "x": 8.815384615384614,
            "y": 2824.0
          },
          {
            "x": 8.923076923076923,
            "y": 2850.0
          },
          {
            "x": 9.03076923076923,
            "y": 2876.0
          },
          {
            "x": 9.138461538461538,
            "y": 2902.0
          },
          {
            "x": 9.246153846153845,
            "y": 2928.0
          },
          {
            "x": 9.353846153846154,
            "y": 2954.0
          },
          {
            "x": 9.461538461538462,
            "y": 2980.0
          },
          {
            "x": 9.569230769230769,
            "y": 3006.0
          },
          {
            "x": 9.676923076923076,
            "y": 3032.0
          },
          {
            "x": 9.784615384615385,
            "y": 3058.0
          },
          {
            "x": 9.892307692307693,
            "y": 3084.0
          },
          {
            "x": 10.0,
            "y": 3110.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1110,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1303,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1554,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1833,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2131,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2445,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2772,
        "time": "17:56"
      },
      {
        "name": "涸沢岳山頂",
        "distance": 10.0,
        "elevation": 3110,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1110,
      "summit_elevation": 3110
    }
  },
  "北穂高岳": {
    "mountain": "北穂高岳",
    "datasets": [
      {
        "label": "北穂高岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1106.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1120.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1135.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1150.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1165.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1180.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1195.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1209.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1224.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1239.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1254.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1269.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1284.1538461538462
          },
          {
            "x": 1.4,
            "y": 1299.0
          },
          {
            "x": 1.4,
            "y": 1299.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1316.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1334.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1352.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1370.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1388.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1406.5714285714287
          },
          {
            "x": 2.15,
            "y": 1424.5
          },
          {
            "x": 2.257142857142857,
            "y": 1442.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1460.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1478.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1496.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1514.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1532.0714285714287
          },
          {
            "x": 2.9,
            "y": 1550.0
          },
          {
            "x": 2.9,
            "y": 1550.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1571.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1592.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1614.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1635.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1657.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1678.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1700.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1721.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1743.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1764.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1786.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1807.5384615384614
          },
          {
            "x": 4.3,
            "y": 1829.0
          },
          {
            "x": 4.3,
            "y": 1829.0
          },
          {
            "x": 4.407692307692307,
            "y": 1851.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1874.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1897.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1920.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1943.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1966.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1989.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 2012.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 2035.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2058.230769230769
          },
          {
            "x": 5.484615384615385,
            "y": 2081.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2104.076923076923
          },
          {
            "x": 5.7,
            "y": 2127.0
          },
          {
            "x": 5.7,
            "y": 2127.0
          },
          {
            "x": 5.816666666666666,
            "y": 2153.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2179.3333333333335
          },
          {
            "x": 6.05,
            "y": 2205.5
          },
          {
            "x": 6.166666666666667,
            "y": 2231.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2257.8333333333335
          },
          {
            "x": 6.4,
            "y": 2284.0
          },
          {
            "x": 6.516666666666667,
            "y": 2310.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2336.3333333333335
          },
          {
            "x": 6.75,
            "y": 2362.5
          },
          {
            "x": 6.866666666666666,
            "y": 2388.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2414.8333333333335
          },
          {
            "x": 7.1,
            "y": 2441.0
          },
          {
            "x": 7.1,
            "y": 2441.0
          },
          {
            "x": 7.207142857142856,
            "y": 2464.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2487.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2511.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2534.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2557.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2581.1428571428573
          },
          {
            "x": 7.85,
            "y": 2604.5
          },
          {
            "x": 7.957142857142856,
            "y": 2627.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2651.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2674.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2697.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2721.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2744.6428571428573
          },
          {
            "x": 8.6,
            "y": 2768.0
          },
          {
            "x": 8.6,
            "y": 2768.0
          },
          {
            "x": 8.707692307692307,
            "y": 2794.0
          },
          {
            "x": 8.815384615384614,
            "y": 2820.0
          },
          {
            "x": 8.923076923076923,
            "y": 2846.0
          },
          {
            "x": 9.03076923076923,
            "y": 2872.0
          },
          {
            "x": 9.138461538461538,
            "y": 2898.0
          },
          {
            "x": 9.246153846153845,
            "y": 2924.0
          },
          {
            "x": 9.353846153846154,
            "y": 2950.0
          },
          {
            "x": 9.461538461538462,
            "y": 2976.0
          },
          {
            "x": 9.569230769230769,
            "y": 3002.0
          },
          {
            "x": 9.676923076923076,
            "y": 3028.0
          },
          {
            "x": 9.784615384615385,
            "y": 3054.0
          },
          {
            "x": 9.892307692307693,
            "y": 3080.0
          },
          {
            "x": 10.0,
            "y": 3106.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1106,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1299,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1550,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1829,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2127,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2441,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2768,
        "time": "17:56"
      },
      {
        "name": "北穂高岳山頂",
        "distance": 10.0,
        "elevation": 3106,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1106,
      "summit_elevation": 3106
    }
  },
  "大喰岳": {
    "mountain": "大喰岳",
    "datasets": [
      {
        "label": "大喰岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1101.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1115.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1130.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1145.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1160.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1175.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1190.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1204.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1219.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1234.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1249.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1264.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1279.1538461538462
          },
          {
            "x": 1.4,
            "y": 1294.0
          },
          {
            "x": 1.4,
            "y": 1294.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1311.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1329.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1347.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1365.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1383.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1401.5714285714287
          },
          {
            "x": 2.15,
            "y": 1419.5
          },
          {
            "x": 2.257142857142857,
            "y": 1437.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1455.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1473.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1491.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1509.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1527.0714285714287
          },
          {
            "x": 2.9,
            "y": 1545.0
          },
          {
            "x": 2.9,
            "y": 1545.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1566.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1587.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1609.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1630.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1652.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1673.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1695.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1716.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1738.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1759.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1781.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1802.5384615384614
          },
          {
            "x": 4.3,
            "y": 1824.0
          },
          {
            "x": 4.3,
            "y": 1824.0
          },
          {
            "x": 4.407692307692307,
            "y": 1846.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1869.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1892.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1915.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1938.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1961.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1984.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 2007.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 2030.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2053.230769230769
          },
          {
            "x": 5.484615384615385,
            "y": 2076.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2099.076923076923
          },
          {
            "x": 5.7,
            "y": 2122.0
          },
          {
            "x": 5.7,
            "y": 2122.0
          },
          {
            "x": 5.816666666666666,
            "y": 2148.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2174.3333333333335
          },
          {
            "x": 6.05,
            "y": 2200.5
          },
          {
            "x": 6.166666666666667,
            "y": 2226.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2252.8333333333335
          },
          {
            "x": 6.4,
            "y": 2279.0
          },
          {
            "x": 6.516666666666667,
            "y": 2305.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2331.3333333333335
          },
          {
            "x": 6.75,
            "y": 2357.5
          },
          {
            "x": 6.866666666666666,
            "y": 2383.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2409.8333333333335
          },
          {
            "x": 7.1,
            "y": 2436.0
          },
          {
            "x": 7.1,
            "y": 2436.0
          },
          {
            "x": 7.207142857142856,
            "y": 2459.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2482.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2506.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2529.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2552.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2576.1428571428573
          },
          {
            "x": 7.85,
            "y": 2599.5
          },
          {
            "x": 7.957142857142856,
            "y": 2622.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2646.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2669.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2692.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2716.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2739.6428571428573
          },
          {
            "x": 8.6,
            "y": 2763.0
          },
          {
            "x": 8.6,
            "y": 2763.0
          },
          {
            "x": 8.707692307692307,
            "y": 2789.0
          },
          {
            "x": 8.815384615384614,
            "y": 2815.0
          },
          {
            "x": 8.923076923076923,
            "y": 2841.0
          },
          {
            "x": 9.03076923076923,
            "y": 2867.0
          },
          {
            "x": 9.138461538461538,
            "y": 2893.0
          },
          {
            "x": 9.246153846153845,
            "y": 2919.0
          },
          {
            "x": 9.353846153846154,
            "y": 2945.0
          },
          {
            "x": 9.461538461538462,
            "y": 2971.0
          },
          {
            "x": 9.569230769230769,
            "y": 2997.0
          },
          {
            "x": 9.676923076923076,
            "y": 3023.0
          },
          {
            "x": 9.784615384615385,
            "y": 3049.0
          },
          {
            "x": 9.892307692307693,
            "y": 3075.0
          },
          {
            "x": 10.0,
            "y": 3101.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1101,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1294,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1545,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1824,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2122,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2436,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2763,
        "time": "17:56"
      },
      {
        "name": "大喰岳山頂",
        "distance": 10.0,
        "elevation": 3101,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1101,
      "summit_elevation": 3101
    }
  },
  "前穂高岳": {
    "mountain": "前穂高岳",
    "datasets": [
      {
        "label": "前穂高岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1090.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1104.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1119.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1134.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1149.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1164.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1179.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1193.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1208.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1223.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1238.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1253.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1268.1538461538462
          },
          {
            "x": 1.4,
            "y": 1283.0
          },
          {
            "x": 1.4,
            "y": 1283.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1300.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1318.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1336.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1354.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1372.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1390.5714285714287
          },
          {
            "x": 2.15,
            "y": 1408.5
          },
          {
            "x": 2.257142857142857,
            "y": 1426.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1444.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1462.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1480.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1498.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1516.0714285714287
          },
          {
            "x": 2.9,
            "y": 1534.0
          },
          {
            "x": 2.9,
            "y": 1534.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1555.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1576.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1598.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1619.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1641.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1662.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1684.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1705.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1727.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1748.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1770.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1791.5384615384614
          },
          {
            "x": 4.3,
            "y": 1813.0
          },
          {
            "x": 4.3,
            "y": 1813.0
          },
          {
            "x": 4.407692307692307,
            "y": 1835.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1858.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1881.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1904.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1927.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1950.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1973.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 1996.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 2019.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2042.2307692307693
          },
          {
            "x": 5.484615384615385,
            "y": 2065.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2088.076923076923
          },
          {
            "x": 5.7,
            "y": 2111.0
          },
          {
            "x": 5.7,
            "y": 2111.0
          },
          {
            "x": 5.816666666666666,
            "y": 2137.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2163.3333333333335
          },
          {
            "x": 6.05,
            "y": 2189.5
          },
          {
            "x": 6.166666666666667,
            "y": 2215.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2241.8333333333335
          },
          {
            "x": 6.4,
            "y": 2268.0
          },
          {
            "x": 6.516666666666667,
            "y": 2294.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2320.3333333333335
          },
          {
            "x": 6.75,
            "y": 2346.5
          },
          {
            "x": 6.866666666666666,
            "y": 2372.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2398.8333333333335
          },
          {
            "x": 7.1,
            "y": 2425.0
          },
          {
            "x": 7.1,
            "y": 2425.0
          },
          {
            "x": 7.207142857142856,
            "y": 2448.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2471.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2495.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2518.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2541.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2565.1428571428573
          },
          {
            "x": 7.85,
            "y": 2588.5
          },
          {
            "x": 7.957142857142856,
            "y": 2611.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2635.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2658.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2681.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2705.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2728.6428571428573
          },
          {
            "x": 8.6,
            "y": 2752.0
          },
          {
            "x": 8.6,
            "y": 2752.0
          },
          {
            "x": 8.707692307692307,
            "y": 2778.0
          },
          {
            "x": 8.815384615384614,
            "y": 2804.0
          },
          {
            "x": 8.923076923076923,
            "y": 2830.0
          },
          {
            "x": 9.03076923076923,
            "y": 2856.0
          },
          {
            "x": 9.138461538461538,
            "y": 2882.0
          },
          {
            "x": 9.246153846153845,
            "y": 2908.0
          },
          {
            "x": 9.353846153846154,
            "y": 2934.0
          },
          {
            "x": 9.461538461538462,
            "y": 2960.0
          },
          {
            "x": 9.569230769230769,
            "y": 2986.0
          },
          {
            "x": 9.676923076923076,
            "y": 3012.0
          },
          {
            "x": 9.784615384615385,
            "y": 3038.0
          },
          {
            "x": 9.892307692307693,
            "y": 3064.0
          },
          {
            "x": 10.0,
            "y": 3090.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1090,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1283,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1534,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1813,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2111,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2425,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2752,
        "time": "17:56"
      },
      {
        "name": "前穂高岳山頂",
        "distance": 10.0,
        "elevation": 3090,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1090,
      "summit_elevation": 3090
    }
  },
  "中岳": {
    "mountain": "中岳",
    "datasets": [
      {
        "label": "中岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1084.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1098.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1113.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1128.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1143.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1158.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1173.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1187.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1202.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1217.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1232.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1247.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1262.1538461538462
          },
          {
            "x": 1.4,
            "y": 1277.0
          },
          {
            "x": 1.4,
            "y": 1277.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1294.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1312.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1330.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1348.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1366.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1384.5714285714287
          },
          {
            "x": 2.15,
            "y": 1402.5
          },
          {
            "x": 2.257142857142857,
            "y": 1420.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1438.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1456.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1474.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1492.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1510.0714285714287
          },
          {
            "x": 2.9,
            "y": 1528.0
          },
          {
            "x": 2.9,
            "y": 1528.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1549.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1570.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1592.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1613.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1635.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1656.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1678.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1699.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1721.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1742.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1764.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1785.5384615384614
          },
          {
            "x": 4.3,
            "y": 1807.0
          },
          {
            "x": 4.3,
            "y": 1807.0
          },
          {
            "x": 4.407692307692307,
            "y": 1829.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1852.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1875.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1898.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1921.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1944.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1967.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 1990.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 2013.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2036.2307692307693
          },
          {
            "x": 5.484615384615385,
            "y": 2059.153846153846
          },
          {
            "x": 5.592307692307692,
            "y": 2082.076923076923
          },
          {
            "x": 5.7,
            "y": 2105.0
          },
          {
            "x": 5.7,
            "y": 2105.0
          },
          {
            "x": 5.816666666666666,
            "y": 2131.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2157.3333333333335
          },
          {
            "x": 6.05,
            "y": 2183.5
          },
          {
            "x": 6.166666666666667,
            "y": 2209.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2235.8333333333335
          },
          {
            "x": 6.4,
            "y": 2262.0
          },
          {
            "x": 6.516666666666667,
            "y": 2288.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2314.3333333333335
          },
          {
            "x": 6.75,
            "y": 2340.5
          },
          {
            "x": 6.866666666666666,
            "y": 2366.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2392.8333333333335
          },
          {
            "x": 7.1,
            "y": 2419.0
          },
          {
            "x": 7.1,
            "y": 2419.0
          },
          {
            "x": 7.207142857142856,
            "y": 2442.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2465.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2489.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2512.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2535.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2559.1428571428573
          },
          {
            "x": 7.85,
            "y": 2582.5
          },
          {
            "x": 7.957142857142856,
            "y": 2605.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2629.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2652.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2675.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2699.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2722.6428571428573
          },
          {
            "x": 8.6,
            "y": 2746.0
          },
          {
            "x": 8.6,
            "y": 2746.0
          },
          {
            "x": 8.707692307692307,
            "y": 2772.0
          },
          {
            "x": 8.815384615384614,
            "y": 2798.0
          },
          {
            "x": 8.923076923076923,
            "y": 2824.0
          },
          {
            "x": 9.03076923076923,
            "y": 2850.0
          },
          {
            "x": 9.138461538461538,
            "y": 2876.0
          },
          {
            "x": 9.246153846153845,
            "y": 2902.0
          },
          {
            "x": 9.353846153846154,
            "y": 2928.0
          },
          {
            "x": 9.461538461538462,
            "y": 2954.0
          },
          {
            "x": 9.569230769230769,
            "y": 2980.0
          },
          {
            "x": 9.676923076923076,
            "y": 3006.0
          },
          {
            "x": 9.784615384615385,
            "y": 3032.0
          },
          {
            "x": 9.892307692307693,
            "y": 3058.0
          },
          {
            "x": 10.0,
            "y": 3084.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1084,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1277,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1528,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1807,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2105,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2419,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2746,
        "time": "17:56"
      },
      {
        "name": "中岳山頂",
        "distance": 10.0,
        "elevation": 3084,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1084,
      "summit_elevation": 3084
    }
  },
  "大天井岳": {
    "mountain": "大天井岳",
    "datasets": [
      {
        "label": "大天井岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.3076923076923
          },
          {
            "x": 0.2153846153846154,
            "y": 1028.6153846153845
          },
          {
            "x": 0.3230769230769231,
            "y": 1042.923076923077
          },
          {
            "x": 0.4307692307692308,
            "y": 1057.2307692307693
          },
          {
            "x": 0.5384615384615384,
            "y": 1071.5384615384614
          },
          {
            "x": 0.6461538461538462,
            "y": 1085.8461538461538
          },
          {
            "x": 0.7538461538461537,
            "y": 1100.1538461538462
          },
          {
            "x": 0.8615384615384616,
            "y": 1114.4615384615386
          },
          {
            "x": 0.9692307692307691,
            "y": 1128.7692307692307
          },
          {
            "x": 1.0769230769230769,
            "y": 1143.076923076923
          },
          {
            "x": 1.1846153846153846,
            "y": 1157.3846153846155
          },
          {
            "x": 1.2923076923076924,
            "y": 1171.6923076923076
          },
          {
            "x": 1.4,
            "y": 1186.0
          },
          {
            "x": 1.4,
            "y": 1186.0
          },
          {
            "x": 1.5083333333333333,
            "y": 1206.0833333333333
          },
          {
            "x": 1.6166666666666667,
            "y": 1226.1666666666667
          },
          {
            "x": 1.725,
            "y": 1246.25
          },
          {
            "x": 1.8333333333333333,
            "y": 1266.3333333333333
          },
          {
            "x": 1.9416666666666669,
            "y": 1286.4166666666667
          },
          {
            "x": 2.05,
            "y": 1306.5
          },
          {
            "x": 2.158333333333333,
            "y": 1326.5833333333333
          },
          {
            "x": 2.2666666666666666,
            "y": 1346.6666666666667
          },
          {
            "x": 2.375,
            "y": 1366.75
          },
          {
            "x": 2.4833333333333334,
            "y": 1386.8333333333333
          },
          {
            "x": 2.591666666666667,
            "y": 1406.9166666666667
          },
          {
            "x": 2.7,
            "y": 1427.0
          },
          {
            "x": 2.7,
            "y": 1427.0
          },
          {
            "x": 2.816666666666667,
            "y": 1449.3333333333333
          },
          {
            "x": 2.9333333333333336,
            "y": 1471.6666666666667
          },
          {
            "x": 3.05,
            "y": 1494.0
          },
          {
            "x": 3.1666666666666665,
            "y": 1516.3333333333333
          },
          {
            "x": 3.283333333333333,
            "y": 1538.6666666666667
          },
          {
            "x": 3.4,
            "y": 1561.0
          },
          {
            "x": 3.5166666666666666,
            "y": 1583.3333333333333
          },
          {
            "x": 3.633333333333333,
            "y": 1605.6666666666667
          },
          {
            "x": 3.75,
            "y": 1628.0
          },
          {
            "x": 3.8666666666666663,
            "y": 1650.3333333333333
          },
          {
            "x": 3.983333333333333,
            "y": 1672.6666666666667
          },
          {
            "x": 4.1,
            "y": 1695.0
          },
          {
            "x": 4.1,
            "y": 1695.0
          },
          {
            "x": 4.207692307692307,
            "y": 1717.0
          },
          {
            "x": 4.315384615384615,
            "y": 1739.0
          },
          {
            "x": 4.4230769230769225,
            "y": 1761.0
          },
          {
            "x": 4.530769230769231,
            "y": 1783.0
          },
          {
            "x": 4.638461538461538,
            "y": 1805.0
          },
          {
            "x": 4.746153846153846,
            "y": 1827.0
          },
          {
            "x": 4.8538461538461535,
            "y": 1849.0
          },
          {
            "x": 4.961538461538462,
            "y": 1871.0
          },
          {
            "x": 5.069230769230769,
            "y": 1893.0
          },
          {
            "x": 5.176923076923077,
            "y": 1915.0
          },
          {
            "x": 5.2846153846153845,
            "y": 1937.0
          },
          {
            "x": 5.392307692307693,
            "y": 1959.0
          },
          {
            "x": 5.5,
            "y": 1981.0
          },
          {
            "x": 5.5,
            "y": 1981.0
          },
          {
            "x": 5.607692307692307,
            "y": 2004.2307692307693
          },
          {
            "x": 5.7153846153846155,
            "y": 2027.4615384615386
          },
          {
            "x": 5.823076923076923,
            "y": 2050.6923076923076
          },
          {
            "x": 5.930769230769231,
            "y": 2073.923076923077
          },
          {
            "x": 6.038461538461538,
            "y": 2097.153846153846
          },
          {
            "x": 6.1461538461538465,
            "y": 2120.3846153846152
          },
          {
            "x": 6.253846153846154,
            "y": 2143.6153846153848
          },
          {
            "x": 6.361538461538462,
            "y": 2166.846153846154
          },
          {
            "x": 6.469230769230769,
            "y": 2190.076923076923
          },
          {
            "x": 6.5769230769230775,
            "y": 2213.3076923076924
          },
          {
            "x": 6.684615384615385,
            "y": 2236.5384615384614
          },
          {
            "x": 6.792307692307693,
            "y": 2259.769230769231
          },
          {
            "x": 6.9,
            "y": 2283.0
          },
          {
            "x": 6.9,
            "y": 2283.0
          },
          {
            "x": 7.0181818181818185,
            "y": 2311.5454545454545
          },
          {
            "x": 7.136363636363637,
            "y": 2340.090909090909
          },
          {
            "x": 7.254545454545455,
            "y": 2368.6363636363635
          },
          {
            "x": 7.372727272727273,
            "y": 2397.181818181818
          },
          {
            "x": 7.49090909090909,
            "y": 2425.7272727272725
          },
          {
            "x": 7.6090909090909085,
            "y": 2454.272727272727
          },
          {
            "x": 7.727272727272727,
            "y": 2482.818181818182
          },
          {
            "x": 7.845454545454545,
            "y": 2511.3636363636365
          },
          {
            "x": 7.963636363636363,
            "y": 2539.909090909091
          },
          {
            "x": 8.081818181818182,
            "y": 2568.4545454545455
          },
          {
            "x": 8.2,
            "y": 2597.0
          },
          {
            "x": 8.2,
            "y": 2597.0
          },
          {
            "x": 8.307692307692307,
            "y": 2622.0
          },
          {
            "x": 8.415384615384614,
            "y": 2647.0
          },
          {
            "x": 8.523076923076923,
            "y": 2672.0
          },
          {
            "x": 8.63076923076923,
            "y": 2697.0
          },
          {
            "x": 8.738461538461538,
            "y": 2722.0
          },
          {
            "x": 8.846153846153845,
            "y": 2747.0
          },
          {
            "x": 8.953846153846154,
            "y": 2772.0
          },
          {
            "x": 9.061538461538461,
            "y": 2797.0
          },
          {
            "x": 9.169230769230769,
            "y": 2822.0
          },
          {
            "x": 9.276923076923076,
            "y": 2847.0
          },
          {
            "x": 9.384615384615383,
            "y": 2872.0
          },
          {
            "x": 9.492307692307692,
            "y": 2897.0
          },
          {
            "x": 9.6,
            "y": 2922.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1186,
        "time": "07:49"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1427,
        "time": "09:43"
      },
      {
        "name": "中間地点3",
        "distance": 4.1,
        "elevation": 1695,
        "time": "11:37"
      },
      {
        "name": "中間地点4",
        "distance": 5.5,
        "elevation": 1981,
        "time": "13:33"
      },
      {
        "name": "山頂付近5",
        "distance": 6.9,
        "elevation": 2283,
        "time": "15:30"
      },
      {
        "name": "山頂付近6",
        "distance": 8.2,
        "elevation": 2597,
        "time": "17:28"
      },
      {
        "name": "大天井岳山頂",
        "distance": 9.6,
        "elevation": 2922,
        "time": "19:26"
      }
    ],
    "stats": {
      "total_distance": 9.6,
      "elevation_gain": 1922,
      "base_elevation": 1000,
      "summit_elevation": 2922
    }
  },
  "常念岳": {
    "mountain": "常念岳",
    "datasets": [
      {
        "label": "常念岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1014.9166666666666
          },
          {
            "x": 0.21666666666666667,
            "y": 1029.8333333333333
          },
          {
            "x": 0.325,
            "y": 1044.75
          },
          {
            "x": 0.43333333333333335,
            "y": 1059.6666666666667
          },
          {
            "x": 0.5416666666666667,
            "y": 1074.5833333333333
          },
          {
            "x": 0.65,
            "y": 1089.5
          },
          {
            "x": 0.7583333333333334,
            "y": 1104.4166666666667
          },
          {
            "x": 0.8666666666666667,
            "y": 1119.3333333333333
          },
          {
            "x": 0.9750000000000001,
            "y": 1134.25
          },
          {
            "x": 1.0833333333333335,
            "y": 1149.1666666666667
          },
          {
            "x": 1.1916666666666667,
            "y": 1164.0833333333333
          },
          {
            "x": 1.3,
            "y": 1179.0
          },
          {
            "x": 1.3,
            "y": 1179.0
          },
          {
            "x": 1.4076923076923078,
            "y": 1196.923076923077
          },
          {
            "x": 1.5153846153846156,
            "y": 1214.8461538461538
          },
          {
            "x": 1.623076923076923,
            "y": 1232.7692307692307
          },
          {
            "x": 1.7307692307692308,
            "y": 1250.6923076923076
          },
          {
            "x": 1.8384615384615386,
            "y": 1268.6153846153845
          },
          {
            "x": 1.9461538461538463,
            "y": 1286.5384615384614
          },
          {
            "x": 2.0538461538461537,
            "y": 1304.4615384615386
          },
          {
            "x": 2.161538461538462,
            "y": 1322.3846153846155
          },
          {
            "x": 2.269230769230769,
            "y": 1340.3076923076924
          },
          {
            "x": 2.3769230769230774,
            "y": 1358.2307692307693
          },
          {
            "x": 2.4846153846153847,
            "y": 1376.1538461538462
          },
          {
            "x": 2.592307692307693,
            "y": 1394.076923076923
          },
          {
            "x": 2.7,
            "y": 1412.0
          },
          {
            "x": 2.7,
            "y": 1412.0
          },
          {
            "x": 2.8181818181818183,
            "y": 1435.5454545454545
          },
          {
            "x": 2.9363636363636365,
            "y": 1459.090909090909
          },
          {
            "x": 3.0545454545454547,
            "y": 1482.6363636363635
          },
          {
            "x": 3.172727272727273,
            "y": 1506.1818181818182
          },
          {
            "x": 3.290909090909091,
            "y": 1529.7272727272727
          },
          {
            "x": 3.409090909090909,
            "y": 1553.2727272727273
          },
          {
            "x": 3.5272727272727273,
            "y": 1576.8181818181818
          },
          {
            "x": 3.6454545454545455,
            "y": 1600.3636363636365
          },
          {
            "x": 3.7636363636363637,
            "y": 1623.909090909091
          },
          {
            "x": 3.881818181818182,
            "y": 1647.4545454545455
          },
          {
            "x": 4.0,
            "y": 1671.0
          },
          {
            "x": 4.0,
            "y": 1671.0
          },
          {
            "x": 4.118181818181818,
            "y": 1696.1818181818182
          },
          {
            "x": 4.236363636363636,
            "y": 1721.3636363636363
          },
          {
            "x": 4.3545454545454545,
            "y": 1746.5454545454545
          },
          {
            "x": 4.472727272727273,
            "y": 1771.7272727272727
          },
          {
            "x": 4.590909090909091,
            "y": 1796.909090909091
          },
          {
            "x": 4.709090909090909,
            "y": 1822.090909090909
          },
          {
            "x": 4.827272727272727,
            "y": 1847.2727272727273
          },
          {
            "x": 4.945454545454545,
            "y": 1872.4545454545455
          },
          {
            "x": 5.0636363636363635,
            "y": 1897.6363636363637
          },
          {
            "x": 5.181818181818182,
            "y": 1922.8181818181818
          },
          {
            "x": 5.3,
            "y": 1948.0
          },
          {
            "x": 5.3,
            "y": 1948.0
          },
          {
            "x": 5.418181818181818,
            "y": 1974.5454545454545
          },
          {
            "x": 5.536363636363636,
            "y": 2001.090909090909
          },
          {
            "x": 5.654545454545454,
            "y": 2027.6363636363635
          },
          {
            "x": 5.7727272727272725,
            "y": 2054.181818181818
          },
          {
            "x": 5.890909090909091,
            "y": 2080.7272727272725
          },
          {
            "x": 6.009090909090909,
            "y": 2107.272727272727
          },
          {
            "x": 6.127272727272727,
            "y": 2133.818181818182
          },
          {
            "x": 6.245454545454545,
            "y": 2160.3636363636365
          },
          {
            "x": 6.363636363636363,
            "y": 2186.909090909091
          },
          {
            "x": 6.4818181818181815,
            "y": 2213.4545454545455
          },
          {
            "x": 6.6,
            "y": 2240.0
          },
          {
            "x": 6.6,
            "y": 2240.0
          },
          {
            "x": 6.707692307692307,
            "y": 2263.3076923076924
          },
          {
            "x": 6.815384615384615,
            "y": 2286.6153846153848
          },
          {
            "x": 6.9230769230769225,
            "y": 2309.923076923077
          },
          {
            "x": 7.030769230769231,
            "y": 2333.230769230769
          },
          {
            "x": 7.138461538461538,
            "y": 2356.5384615384614
          },
          {
            "x": 7.246153846153846,
            "y": 2379.846153846154
          },
          {
            "x": 7.3538461538461535,
            "y": 2403.153846153846
          },
          {
            "x": 7.461538461538462,
            "y": 2426.4615384615386
          },
          {
            "x": 7.569230769230769,
            "y": 2449.769230769231
          },
          {
            "x": 7.676923076923077,
            "y": 2473.076923076923
          },
          {
            "x": 7.7846153846153845,
            "y": 2496.3846153846152
          },
          {
            "x": 7.892307692307693,
            "y": 2519.6923076923076
          },
          {
            "x": 8.0,
            "y": 2543.0
          },
          {
            "x": 8.0,
            "y": 2543.0
          },
          {
            "x": 8.108333333333334,
            "y": 2569.1666666666665
          },
          {
            "x": 8.216666666666667,
            "y": 2595.3333333333335
          },
          {
            "x": 8.325,
            "y": 2621.5
          },
          {
            "x": 8.433333333333334,
            "y": 2647.6666666666665
          },
          {
            "x": 8.541666666666668,
            "y": 2673.8333333333335
          },
          {
            "x": 8.65,
            "y": 2700.0
          },
          {
            "x": 8.758333333333333,
            "y": 2726.1666666666665
          },
          {
            "x": 8.866666666666667,
            "y": 2752.3333333333335
          },
          {
            "x": 8.975000000000001,
            "y": 2778.5
          },
          {
            "x": 9.083333333333334,
            "y": 2804.6666666666665
          },
          {
            "x": 9.191666666666666,
            "y": 2830.8333333333335
          },
          {
            "x": 9.3,
            "y": 2857.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1179,
        "time": "07:46"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1412,
        "time": "09:36"
      },
      {
        "name": "中間地点3",
        "distance": 4.0,
        "elevation": 1671,
        "time": "11:27"
      },
      {
        "name": "中間地点4",
        "distance": 5.3,
        "elevation": 1948,
        "time": "13:19"
      },
      {
        "name": "山頂付近5",
        "distance": 6.6,
        "elevation": 2240,
        "time": "15:12"
      },
      {
        "name": "山頂付近6",
        "distance": 8.0,
        "elevation": 2543,
        "time": "17:06"
      },
      {
        "name": "常念岳山頂",
        "distance": 9.3,
        "elevation": 2857,
        "time": "19:01"
      }
    ],
    "stats": {
      "total_distance": 9.3,
      "elevation_gain": 1857,
      "base_elevation": 1000,
      "summit_elevation": 2857
    }
  },
  "奥大日岳": {
    "mountain": "奥大日岳",
    "datasets": [
      {
        "label": "奥大日岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.11000000000000001,
            "y": 1015.5
          },
          {
            "x": 0.22000000000000003,
            "y": 1031.0
          },
          {
            "x": 0.33,
            "y": 1046.5
          },
          {
            "x": 0.44000000000000006,
            "y": 1062.0
          },
          {
            "x": 0.55,
            "y": 1077.5
          },
          {
            "x": 0.66,
            "y": 1093.0
          },
          {
            "x": 0.77,
            "y": 1108.5
          },
          {
            "x": 0.8800000000000001,
            "y": 1124.0
          },
          {
            "x": 0.9900000000000001,
            "y": 1139.5
          },
          {
            "x": 1.1,
            "y": 1155.0
          },
          {
            "x": 1.1,
            "y": 1155.0
          },
          {
            "x": 1.22,
            "y": 1175.2
          },
          {
            "x": 1.34,
            "y": 1195.4
          },
          {
            "x": 1.46,
            "y": 1215.6
          },
          {
            "x": 1.58,
            "y": 1235.8
          },
          {
            "x": 1.7,
            "y": 1256.0
          },
          {
            "x": 1.8199999999999998,
            "y": 1276.2
          },
          {
            "x": 1.94,
            "y": 1296.4
          },
          {
            "x": 2.06,
            "y": 1316.6
          },
          {
            "x": 2.1799999999999997,
            "y": 1336.8
          },
          {
            "x": 2.3,
            "y": 1357.0
          },
          {
            "x": 2.3,
            "y": 1357.0
          },
          {
            "x": 2.4099999999999997,
            "y": 1379.3
          },
          {
            "x": 2.52,
            "y": 1401.6
          },
          {
            "x": 2.63,
            "y": 1423.9
          },
          {
            "x": 2.7399999999999998,
            "y": 1446.2
          },
          {
            "x": 2.8499999999999996,
            "y": 1468.5
          },
          {
            "x": 2.96,
            "y": 1490.8
          },
          {
            "x": 3.07,
            "y": 1513.1
          },
          {
            "x": 3.1799999999999997,
            "y": 1535.4
          },
          {
            "x": 3.29,
            "y": 1557.7
          },
          {
            "x": 3.4,
            "y": 1580.0
          },
          {
            "x": 3.4,
            "y": 1580.0
          },
          {
            "x": 3.52,
            "y": 1604.0
          },
          {
            "x": 3.6399999999999997,
            "y": 1628.0
          },
          {
            "x": 3.76,
            "y": 1652.0
          },
          {
            "x": 3.88,
            "y": 1676.0
          },
          {
            "x": 4.0,
            "y": 1700.0
          },
          {
            "x": 4.12,
            "y": 1724.0
          },
          {
            "x": 4.239999999999999,
            "y": 1748.0
          },
          {
            "x": 4.359999999999999,
            "y": 1772.0
          },
          {
            "x": 4.4799999999999995,
            "y": 1796.0
          },
          {
            "x": 4.6,
            "y": 1820.0
          },
          {
            "x": 4.6,
            "y": 1820.0
          },
          {
            "x": 4.71,
            "y": 1845.2
          },
          {
            "x": 4.819999999999999,
            "y": 1870.4
          },
          {
            "x": 4.93,
            "y": 1895.6
          },
          {
            "x": 5.04,
            "y": 1920.8
          },
          {
            "x": 5.15,
            "y": 1946.0
          },
          {
            "x": 5.26,
            "y": 1971.2
          },
          {
            "x": 5.37,
            "y": 1996.4
          },
          {
            "x": 5.48,
            "y": 2021.6
          },
          {
            "x": 5.59,
            "y": 2046.8
          },
          {
            "x": 5.7,
            "y": 2072.0
          },
          {
            "x": 5.7,
            "y": 2072.0
          },
          {
            "x": 5.8090909090909095,
            "y": 2095.818181818182
          },
          {
            "x": 5.918181818181818,
            "y": 2119.6363636363635
          },
          {
            "x": 6.027272727272727,
            "y": 2143.4545454545455
          },
          {
            "x": 6.136363636363637,
            "y": 2167.2727272727275
          },
          {
            "x": 6.245454545454546,
            "y": 2191.090909090909
          },
          {
            "x": 6.3545454545454545,
            "y": 2214.909090909091
          },
          {
            "x": 6.463636363636364,
            "y": 2238.7272727272725
          },
          {
            "x": 6.572727272727273,
            "y": 2262.5454545454545
          },
          {
            "x": 6.6818181818181825,
            "y": 2286.3636363636365
          },
          {
            "x": 6.790909090909091,
            "y": 2310.181818181818
          },
          {
            "x": 6.9,
            "y": 2334.0
          },
          {
            "x": 6.9,
            "y": 2334.0
          },
          {
            "x": 7.022222222222222,
            "y": 2364.222222222222
          },
          {
            "x": 7.144444444444445,
            "y": 2394.4444444444443
          },
          {
            "x": 7.266666666666667,
            "y": 2424.6666666666665
          },
          {
            "x": 7.388888888888889,
            "y": 2454.8888888888887
          },
          {
            "x": 7.511111111111111,
            "y": 2485.1111111111113
          },
          {
            "x": 7.633333333333334,
            "y": 2515.3333333333335
          },
          {
            "x": 7.7555555555555555,
            "y": 2545.5555555555557
          },
          {
            "x": 7.877777777777778,
            "y": 2575.777777777778
          },
          {
            "x": 8.0,
            "y": 2606.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.1,
        "elevation": 1155,
        "time": "07:31"
      },
      {
        "name": "登山道2合目",
        "distance": 2.3,
        "elevation": 1357,
        "time": "09:05"
      },
      {
        "name": "中間地点3",
        "distance": 3.4,
        "elevation": 1580,
        "time": "10:41"
      },
      {
        "name": "中間地点4",
        "distance": 4.6,
        "elevation": 1820,
        "time": "12:18"
      },
      {
        "name": "山頂付近5",
        "distance": 5.7,
        "elevation": 2072,
        "time": "13:55"
      },
      {
        "name": "山頂付近6",
        "distance": 6.9,
        "elevation": 2334,
        "time": "15:33"
      },
      {
        "name": "奥大日岳山頂",
        "distance": 8.0,
        "elevation": 2606,
        "time": "17:12"
      }
    ],
    "stats": {
      "total_distance": 8.0,
      "elevation_gain": 1606,
      "base_elevation": 1000,
      "summit_elevation": 2606
    }
  },
  "立山（雄山）": {
    "mountain": "立山（雄山）",
    "datasets": [
      {
        "label": "立山（雄山） 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1003.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1017.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1032.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1047.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1062.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1077.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1092.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1106.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1121.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1136.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1151.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1166.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1181.1538461538462
          },
          {
            "x": 1.4,
            "y": 1196.0
          },
          {
            "x": 1.4,
            "y": 1196.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1213.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1231.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1249.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1267.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1285.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1303.5714285714287
          },
          {
            "x": 2.15,
            "y": 1321.5
          },
          {
            "x": 2.257142857142857,
            "y": 1339.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1357.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1375.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1393.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1411.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1429.0714285714287
          },
          {
            "x": 2.9,
            "y": 1447.0
          },
          {
            "x": 2.9,
            "y": 1447.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1468.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1489.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1511.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1532.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1554.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1575.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1597.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1618.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1640.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1661.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1683.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1704.5384615384614
          },
          {
            "x": 4.3,
            "y": 1726.0
          },
          {
            "x": 4.3,
            "y": 1726.0
          },
          {
            "x": 4.407692307692307,
            "y": 1748.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1771.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1794.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1817.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1840.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1863.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1886.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 1909.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 1932.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 1955.2307692307693
          },
          {
            "x": 5.484615384615385,
            "y": 1978.1538461538462
          },
          {
            "x": 5.592307692307692,
            "y": 2001.076923076923
          },
          {
            "x": 5.7,
            "y": 2024.0
          },
          {
            "x": 5.7,
            "y": 2024.0
          },
          {
            "x": 5.816666666666666,
            "y": 2050.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2076.3333333333335
          },
          {
            "x": 6.05,
            "y": 2102.5
          },
          {
            "x": 6.166666666666667,
            "y": 2128.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2154.8333333333335
          },
          {
            "x": 6.4,
            "y": 2181.0
          },
          {
            "x": 6.516666666666667,
            "y": 2207.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2233.3333333333335
          },
          {
            "x": 6.75,
            "y": 2259.5
          },
          {
            "x": 6.866666666666666,
            "y": 2285.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2311.8333333333335
          },
          {
            "x": 7.1,
            "y": 2338.0
          },
          {
            "x": 7.1,
            "y": 2338.0
          },
          {
            "x": 7.207142857142856,
            "y": 2361.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2384.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2408.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2431.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2454.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2478.1428571428573
          },
          {
            "x": 7.85,
            "y": 2501.5
          },
          {
            "x": 7.957142857142856,
            "y": 2524.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2548.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2571.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2594.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2618.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2641.6428571428573
          },
          {
            "x": 8.6,
            "y": 2665.0
          },
          {
            "x": 8.6,
            "y": 2665.0
          },
          {
            "x": 8.707692307692307,
            "y": 2691.0
          },
          {
            "x": 8.815384615384614,
            "y": 2717.0
          },
          {
            "x": 8.923076923076923,
            "y": 2743.0
          },
          {
            "x": 9.03076923076923,
            "y": 2769.0
          },
          {
            "x": 9.138461538461538,
            "y": 2795.0
          },
          {
            "x": 9.246153846153845,
            "y": 2821.0
          },
          {
            "x": 9.353846153846154,
            "y": 2847.0
          },
          {
            "x": 9.461538461538462,
            "y": 2873.0
          },
          {
            "x": 9.569230769230769,
            "y": 2899.0
          },
          {
            "x": 9.676923076923076,
            "y": 2925.0
          },
          {
            "x": 9.784615384615385,
            "y": 2951.0
          },
          {
            "x": 9.892307692307693,
            "y": 2977.0
          },
          {
            "x": 10.0,
            "y": 3003.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1003,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1196,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1447,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1726,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2024,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2338,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2665,
        "time": "17:56"
      },
      {
        "name": "立山（雄山）山頂",
        "distance": 10.0,
        "elevation": 3003,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1003,
      "summit_elevation": 3003
    }
  },
  "剱岳": {
    "mountain": "剱岳",
    "datasets": [
      {
        "label": "剱岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1029.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1044.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1059.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1074.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1089.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1103.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1118.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1133.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1148.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1163.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1178.1538461538462
          },
          {
            "x": 1.4,
            "y": 1193.0
          },
          {
            "x": 1.4,
            "y": 1193.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1210.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1228.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1246.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1264.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1282.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1300.5714285714287
          },
          {
            "x": 2.15,
            "y": 1318.5
          },
          {
            "x": 2.257142857142857,
            "y": 1336.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1354.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1372.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1390.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1408.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1426.0714285714287
          },
          {
            "x": 2.9,
            "y": 1444.0
          },
          {
            "x": 2.9,
            "y": 1444.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1465.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1486.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1508.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1529.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1551.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1572.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1594.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1615.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1637.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1658.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1680.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1701.5384615384614
          },
          {
            "x": 4.3,
            "y": 1723.0
          },
          {
            "x": 4.3,
            "y": 1723.0
          },
          {
            "x": 4.407692307692307,
            "y": 1745.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1768.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1791.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1814.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1837.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1860.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1883.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 1906.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 1929.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 1952.2307692307693
          },
          {
            "x": 5.484615384615385,
            "y": 1975.1538461538462
          },
          {
            "x": 5.592307692307692,
            "y": 1998.076923076923
          },
          {
            "x": 5.7,
            "y": 2021.0
          },
          {
            "x": 5.7,
            "y": 2021.0
          },
          {
            "x": 5.816666666666666,
            "y": 2047.0833333333333
          },
          {
            "x": 5.933333333333334,
            "y": 2073.1666666666665
          },
          {
            "x": 6.05,
            "y": 2099.25
          },
          {
            "x": 6.166666666666667,
            "y": 2125.3333333333335
          },
          {
            "x": 6.283333333333333,
            "y": 2151.4166666666665
          },
          {
            "x": 6.4,
            "y": 2177.5
          },
          {
            "x": 6.516666666666667,
            "y": 2203.5833333333335
          },
          {
            "x": 6.633333333333333,
            "y": 2229.6666666666665
          },
          {
            "x": 6.75,
            "y": 2255.75
          },
          {
            "x": 6.866666666666666,
            "y": 2281.8333333333335
          },
          {
            "x": 6.9833333333333325,
            "y": 2307.9166666666665
          },
          {
            "x": 7.1,
            "y": 2334.0
          },
          {
            "x": 7.1,
            "y": 2334.0
          },
          {
            "x": 7.207142857142856,
            "y": 2357.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2380.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2404.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2427.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2450.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2474.1428571428573
          },
          {
            "x": 7.85,
            "y": 2497.5
          },
          {
            "x": 7.957142857142856,
            "y": 2520.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2544.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2567.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2590.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2614.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2637.6428571428573
          },
          {
            "x": 8.6,
            "y": 2661.0
          },
          {
            "x": 8.6,
            "y": 2661.0
          },
          {
            "x": 8.707692307692307,
            "y": 2687.0
          },
          {
            "x": 8.815384615384614,
            "y": 2713.0
          },
          {
            "x": 8.923076923076923,
            "y": 2739.0
          },
          {
            "x": 9.03076923076923,
            "y": 2765.0
          },
          {
            "x": 9.138461538461538,
            "y": 2791.0
          },
          {
            "x": 9.246153846153845,
            "y": 2817.0
          },
          {
            "x": 9.353846153846154,
            "y": 2843.0
          },
          {
            "x": 9.461538461538462,
            "y": 2869.0
          },
          {
            "x": 9.569230769230769,
            "y": 2895.0
          },
          {
            "x": 9.676923076923076,
            "y": 2921.0
          },
          {
            "x": 9.784615384615385,
            "y": 2947.0
          },
          {
            "x": 9.892307692307693,
            "y": 2973.0
          },
          {
            "x": 10.0,
            "y": 2999.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1193,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1444,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1723,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2021,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2334,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2661,
        "time": "17:56"
      },
      {
        "name": "剱岳山頂",
        "distance": 10.0,
        "elevation": 2999,
        "time": "19:59"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 1999,
      "base_elevation": 1000,
      "summit_elevation": 2999
    }
  },
  "水晶岳": {
    "mountain": "水晶岳",
    "datasets": [
      {
        "label": "水晶岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.7692307692307
          },
          {
            "x": 0.2153846153846154,
            "y": 1029.5384615384614
          },
          {
            "x": 0.3230769230769231,
            "y": 1044.3076923076924
          },
          {
            "x": 0.4307692307692308,
            "y": 1059.076923076923
          },
          {
            "x": 0.5384615384615384,
            "y": 1073.8461538461538
          },
          {
            "x": 0.6461538461538462,
            "y": 1088.6153846153845
          },
          {
            "x": 0.7538461538461537,
            "y": 1103.3846153846155
          },
          {
            "x": 0.8615384615384616,
            "y": 1118.1538461538462
          },
          {
            "x": 0.9692307692307691,
            "y": 1132.923076923077
          },
          {
            "x": 1.0769230769230769,
            "y": 1147.6923076923076
          },
          {
            "x": 1.1846153846153846,
            "y": 1162.4615384615386
          },
          {
            "x": 1.2923076923076924,
            "y": 1177.2307692307693
          },
          {
            "x": 1.4,
            "y": 1192.0
          },
          {
            "x": 1.4,
            "y": 1192.0
          },
          {
            "x": 1.5076923076923077,
            "y": 1211.1538461538462
          },
          {
            "x": 1.6153846153846154,
            "y": 1230.3076923076924
          },
          {
            "x": 1.723076923076923,
            "y": 1249.4615384615386
          },
          {
            "x": 1.8307692307692307,
            "y": 1268.6153846153845
          },
          {
            "x": 1.9384615384615382,
            "y": 1287.7692307692307
          },
          {
            "x": 2.046153846153846,
            "y": 1306.923076923077
          },
          {
            "x": 2.1538461538461537,
            "y": 1326.076923076923
          },
          {
            "x": 2.2615384615384615,
            "y": 1345.2307692307693
          },
          {
            "x": 2.369230769230769,
            "y": 1364.3846153846155
          },
          {
            "x": 2.476923076923077,
            "y": 1383.5384615384614
          },
          {
            "x": 2.5846153846153843,
            "y": 1402.6923076923076
          },
          {
            "x": 2.6923076923076925,
            "y": 1421.8461538461538
          },
          {
            "x": 2.8,
            "y": 1441.0
          },
          {
            "x": 2.8,
            "y": 1441.0
          },
          {
            "x": 2.9076923076923076,
            "y": 1462.3076923076924
          },
          {
            "x": 3.0153846153846153,
            "y": 1483.6153846153845
          },
          {
            "x": 3.123076923076923,
            "y": 1504.923076923077
          },
          {
            "x": 3.230769230769231,
            "y": 1526.2307692307693
          },
          {
            "x": 3.3384615384615386,
            "y": 1547.5384615384614
          },
          {
            "x": 3.4461538461538463,
            "y": 1568.8461538461538
          },
          {
            "x": 3.5538461538461537,
            "y": 1590.1538461538462
          },
          {
            "x": 3.661538461538462,
            "y": 1611.4615384615386
          },
          {
            "x": 3.769230769230769,
            "y": 1632.7692307692307
          },
          {
            "x": 3.8769230769230774,
            "y": 1654.076923076923
          },
          {
            "x": 3.9846153846153847,
            "y": 1675.3846153846155
          },
          {
            "x": 4.092307692307692,
            "y": 1696.6923076923076
          },
          {
            "x": 4.2,
            "y": 1718.0
          },
          {
            "x": 4.2,
            "y": 1718.0
          },
          {
            "x": 4.307142857142857,
            "y": 1739.142857142857
          },
          {
            "x": 4.414285714285715,
            "y": 1760.2857142857142
          },
          {
            "x": 4.521428571428571,
            "y": 1781.4285714285713
          },
          {
            "x": 4.628571428571429,
            "y": 1802.5714285714287
          },
          {
            "x": 4.735714285714286,
            "y": 1823.7142857142858
          },
          {
            "x": 4.842857142857143,
            "y": 1844.857142857143
          },
          {
            "x": 4.95,
            "y": 1866.0
          },
          {
            "x": 5.057142857142857,
            "y": 1887.142857142857
          },
          {
            "x": 5.164285714285715,
            "y": 1908.2857142857142
          },
          {
            "x": 5.271428571428571,
            "y": 1929.4285714285716
          },
          {
            "x": 5.378571428571429,
            "y": 1950.5714285714284
          },
          {
            "x": 5.485714285714286,
            "y": 1971.7142857142858
          },
          {
            "x": 5.592857142857143,
            "y": 1992.857142857143
          },
          {
            "x": 5.7,
            "y": 2014.0
          },
          {
            "x": 5.7,
            "y": 2014.0
          },
          {
            "x": 5.816666666666666,
            "y": 2040.0
          },
          {
            "x": 5.933333333333334,
            "y": 2066.0
          },
          {
            "x": 6.05,
            "y": 2092.0
          },
          {
            "x": 6.166666666666667,
            "y": 2118.0
          },
          {
            "x": 6.283333333333333,
            "y": 2144.0
          },
          {
            "x": 6.4,
            "y": 2170.0
          },
          {
            "x": 6.516666666666667,
            "y": 2196.0
          },
          {
            "x": 6.633333333333333,
            "y": 2222.0
          },
          {
            "x": 6.75,
            "y": 2248.0
          },
          {
            "x": 6.866666666666666,
            "y": 2274.0
          },
          {
            "x": 6.9833333333333325,
            "y": 2300.0
          },
          {
            "x": 7.1,
            "y": 2326.0
          },
          {
            "x": 7.1,
            "y": 2326.0
          },
          {
            "x": 7.207692307692307,
            "y": 2350.923076923077
          },
          {
            "x": 7.315384615384615,
            "y": 2375.846153846154
          },
          {
            "x": 7.4230769230769225,
            "y": 2400.769230769231
          },
          {
            "x": 7.530769230769231,
            "y": 2425.6923076923076
          },
          {
            "x": 7.638461538461538,
            "y": 2450.6153846153848
          },
          {
            "x": 7.746153846153846,
            "y": 2475.5384615384614
          },
          {
            "x": 7.8538461538461535,
            "y": 2500.4615384615386
          },
          {
            "x": 7.961538461538462,
            "y": 2525.3846153846152
          },
          {
            "x": 8.069230769230769,
            "y": 2550.3076923076924
          },
          {
            "x": 8.176923076923076,
            "y": 2575.230769230769
          },
          {
            "x": 8.284615384615385,
            "y": 2600.153846153846
          },
          {
            "x": 8.392307692307693,
            "y": 2625.076923076923
          },
          {
            "x": 8.5,
            "y": 2650.0
          },
          {
            "x": 8.5,
            "y": 2650.0
          },
          {
            "x": 8.607692307692307,
            "y": 2675.846153846154
          },
          {
            "x": 8.715384615384615,
            "y": 2701.6923076923076
          },
          {
            "x": 8.823076923076924,
            "y": 2727.5384615384614
          },
          {
            "x": 8.930769230769231,
            "y": 2753.3846153846152
          },
          {
            "x": 9.038461538461538,
            "y": 2779.230769230769
          },
          {
            "x": 9.146153846153846,
            "y": 2805.076923076923
          },
          {
            "x": 9.253846153846155,
            "y": 2830.923076923077
          },
          {
            "x": 9.361538461538462,
            "y": 2856.769230769231
          },
          {
            "x": 9.46923076923077,
            "y": 2882.6153846153848
          },
          {
            "x": 9.576923076923077,
            "y": 2908.4615384615386
          },
          {
            "x": 9.684615384615384,
            "y": 2934.3076923076924
          },
          {
            "x": 9.792307692307693,
            "y": 2960.153846153846
          },
          {
            "x": 9.9,
            "y": 2986.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1192,
        "time": "07:53"
      },
      {
        "name": "登山道2合目",
        "distance": 2.8,
        "elevation": 1441,
        "time": "09:50"
      },
      {
        "name": "中間地点3",
        "distance": 4.2,
        "elevation": 1718,
        "time": "11:48"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2014,
        "time": "13:48"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2326,
        "time": "15:48"
      },
      {
        "name": "山頂付近6",
        "distance": 8.5,
        "elevation": 2650,
        "time": "17:49"
      },
      {
        "name": "水晶岳山頂",
        "distance": 9.9,
        "elevation": 2986,
        "time": "19:51"
      }
    ],
    "stats": {
      "total_distance": 9.9,
      "elevation_gain": 1986,
      "base_elevation": 1000,
      "summit_elevation": 2986
    }
  },
  "鷲羽岳": {
    "mountain": "鷲羽岳",
    "datasets": [
      {
        "label": "鷲羽岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.3076923076923
          },
          {
            "x": 0.2153846153846154,
            "y": 1028.6153846153845
          },
          {
            "x": 0.3230769230769231,
            "y": 1042.923076923077
          },
          {
            "x": 0.4307692307692308,
            "y": 1057.2307692307693
          },
          {
            "x": 0.5384615384615384,
            "y": 1071.5384615384614
          },
          {
            "x": 0.6461538461538462,
            "y": 1085.8461538461538
          },
          {
            "x": 0.7538461538461537,
            "y": 1100.1538461538462
          },
          {
            "x": 0.8615384615384616,
            "y": 1114.4615384615386
          },
          {
            "x": 0.9692307692307691,
            "y": 1128.7692307692307
          },
          {
            "x": 1.0769230769230769,
            "y": 1143.076923076923
          },
          {
            "x": 1.1846153846153846,
            "y": 1157.3846153846155
          },
          {
            "x": 1.2923076923076924,
            "y": 1171.6923076923076
          },
          {
            "x": 1.4,
            "y": 1186.0
          },
          {
            "x": 1.4,
            "y": 1186.0
          },
          {
            "x": 1.5083333333333333,
            "y": 1206.0833333333333
          },
          {
            "x": 1.6166666666666667,
            "y": 1226.1666666666667
          },
          {
            "x": 1.725,
            "y": 1246.25
          },
          {
            "x": 1.8333333333333333,
            "y": 1266.3333333333333
          },
          {
            "x": 1.9416666666666669,
            "y": 1286.4166666666667
          },
          {
            "x": 2.05,
            "y": 1306.5
          },
          {
            "x": 2.158333333333333,
            "y": 1326.5833333333333
          },
          {
            "x": 2.2666666666666666,
            "y": 1346.6666666666667
          },
          {
            "x": 2.375,
            "y": 1366.75
          },
          {
            "x": 2.4833333333333334,
            "y": 1386.8333333333333
          },
          {
            "x": 2.591666666666667,
            "y": 1406.9166666666667
          },
          {
            "x": 2.7,
            "y": 1427.0
          },
          {
            "x": 2.7,
            "y": 1427.0
          },
          {
            "x": 2.816666666666667,
            "y": 1449.4166666666667
          },
          {
            "x": 2.9333333333333336,
            "y": 1471.8333333333333
          },
          {
            "x": 3.05,
            "y": 1494.25
          },
          {
            "x": 3.1666666666666665,
            "y": 1516.6666666666667
          },
          {
            "x": 3.283333333333333,
            "y": 1539.0833333333333
          },
          {
            "x": 3.4,
            "y": 1561.5
          },
          {
            "x": 3.5166666666666666,
            "y": 1583.9166666666667
          },
          {
            "x": 3.633333333333333,
            "y": 1606.3333333333333
          },
          {
            "x": 3.75,
            "y": 1628.75
          },
          {
            "x": 3.8666666666666663,
            "y": 1651.1666666666667
          },
          {
            "x": 3.983333333333333,
            "y": 1673.5833333333333
          },
          {
            "x": 4.1,
            "y": 1696.0
          },
          {
            "x": 4.1,
            "y": 1696.0
          },
          {
            "x": 4.207692307692307,
            "y": 1718.076923076923
          },
          {
            "x": 4.315384615384615,
            "y": 1740.1538461538462
          },
          {
            "x": 4.4230769230769225,
            "y": 1762.2307692307693
          },
          {
            "x": 4.530769230769231,
            "y": 1784.3076923076924
          },
          {
            "x": 4.638461538461538,
            "y": 1806.3846153846155
          },
          {
            "x": 4.746153846153846,
            "y": 1828.4615384615386
          },
          {
            "x": 4.8538461538461535,
            "y": 1850.5384615384614
          },
          {
            "x": 4.961538461538462,
            "y": 1872.6153846153845
          },
          {
            "x": 5.069230769230769,
            "y": 1894.6923076923076
          },
          {
            "x": 5.176923076923077,
            "y": 1916.7692307692307
          },
          {
            "x": 5.2846153846153845,
            "y": 1938.8461538461538
          },
          {
            "x": 5.392307692307693,
            "y": 1960.923076923077
          },
          {
            "x": 5.5,
            "y": 1983.0
          },
          {
            "x": 5.5,
            "y": 1983.0
          },
          {
            "x": 5.607692307692307,
            "y": 2006.1538461538462
          },
          {
            "x": 5.7153846153846155,
            "y": 2029.3076923076924
          },
          {
            "x": 5.823076923076923,
            "y": 2052.4615384615386
          },
          {
            "x": 5.930769230769231,
            "y": 2075.6153846153848
          },
          {
            "x": 6.038461538461538,
            "y": 2098.769230769231
          },
          {
            "x": 6.1461538461538465,
            "y": 2121.923076923077
          },
          {
            "x": 6.253846153846154,
            "y": 2145.076923076923
          },
          {
            "x": 6.361538461538462,
            "y": 2168.230769230769
          },
          {
            "x": 6.469230769230769,
            "y": 2191.3846153846152
          },
          {
            "x": 6.5769230769230775,
            "y": 2214.5384615384614
          },
          {
            "x": 6.684615384615385,
            "y": 2237.6923076923076
          },
          {
            "x": 6.792307692307693,
            "y": 2260.846153846154
          },
          {
            "x": 6.9,
            "y": 2284.0
          },
          {
            "x": 6.9,
            "y": 2284.0
          },
          {
            "x": 7.0181818181818185,
            "y": 2312.6363636363635
          },
          {
            "x": 7.136363636363637,
            "y": 2341.2727272727275
          },
          {
            "x": 7.254545454545455,
            "y": 2369.909090909091
          },
          {
            "x": 7.372727272727273,
            "y": 2398.5454545454545
          },
          {
            "x": 7.49090909090909,
            "y": 2427.181818181818
          },
          {
            "x": 7.6090909090909085,
            "y": 2455.818181818182
          },
          {
            "x": 7.727272727272727,
            "y": 2484.4545454545455
          },
          {
            "x": 7.845454545454545,
            "y": 2513.090909090909
          },
          {
            "x": 7.963636363636363,
            "y": 2541.727272727273
          },
          {
            "x": 8.081818181818182,
            "y": 2570.3636363636365
          },
          {
            "x": 8.2,
            "y": 2599.0
          },
          {
            "x": 8.2,
            "y": 2599.0
          },
          {
            "x": 8.307692307692307,
            "y": 2624.0
          },
          {
            "x": 8.415384615384614,
            "y": 2649.0
          },
          {
            "x": 8.523076923076923,
            "y": 2674.0
          },
          {
            "x": 8.63076923076923,
            "y": 2699.0
          },
          {
            "x": 8.738461538461538,
            "y": 2724.0
          },
          {
            "x": 8.846153846153845,
            "y": 2749.0
          },
          {
            "x": 8.953846153846154,
            "y": 2774.0
          },
          {
            "x": 9.061538461538461,
            "y": 2799.0
          },
          {
            "x": 9.169230769230769,
            "y": 2824.0
          },
          {
            "x": 9.276923076923076,
            "y": 2849.0
          },
          {
            "x": 9.384615384615383,
            "y": 2874.0
          },
          {
            "x": 9.492307692307692,
            "y": 2899.0
          },
          {
            "x": 9.6,
            "y": 2924.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1186,
        "time": "07:49"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1427,
        "time": "09:43"
      },
      {
        "name": "中間地点3",
        "distance": 4.1,
        "elevation": 1696,
        "time": "11:37"
      },
      {
        "name": "中間地点4",
        "distance": 5.5,
        "elevation": 1983,
        "time": "13:33"
      },
      {
        "name": "山頂付近5",
        "distance": 6.9,
        "elevation": 2284,
        "time": "15:30"
      },
      {
        "name": "山頂付近6",
        "distance": 8.2,
        "elevation": 2599,
        "time": "17:28"
      },
      {
        "name": "鷲羽岳山頂",
        "distance": 9.6,
        "elevation": 2924,
        "time": "19:26"
      }
    ],
    "stats": {
      "total_distance": 9.6,
      "elevation_gain": 1924,
      "base_elevation": 1000,
      "summit_elevation": 2924
    }
  },
  "野口五郎岳": {
    "mountain": "野口五郎岳",
    "datasets": [
      {
        "label": "野口五郎岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.3076923076923
          },
          {
            "x": 0.2153846153846154,
            "y": 1028.6153846153845
          },
          {
            "x": 0.3230769230769231,
            "y": 1042.923076923077
          },
          {
            "x": 0.4307692307692308,
            "y": 1057.2307692307693
          },
          {
            "x": 0.5384615384615384,
            "y": 1071.5384615384614
          },
          {
            "x": 0.6461538461538462,
            "y": 1085.8461538461538
          },
          {
            "x": 0.7538461538461537,
            "y": 1100.1538461538462
          },
          {
            "x": 0.8615384615384616,
            "y": 1114.4615384615386
          },
          {
            "x": 0.9692307692307691,
            "y": 1128.7692307692307
          },
          {
            "x": 1.0769230769230769,
            "y": 1143.076923076923
          },
          {
            "x": 1.1846153846153846,
            "y": 1157.3846153846155
          },
          {
            "x": 1.2923076923076924,
            "y": 1171.6923076923076
          },
          {
            "x": 1.4,
            "y": 1186.0
          },
          {
            "x": 1.4,
            "y": 1186.0
          },
          {
            "x": 1.5083333333333333,
            "y": 1206.0833333333333
          },
          {
            "x": 1.6166666666666667,
            "y": 1226.1666666666667
          },
          {
            "x": 1.725,
            "y": 1246.25
          },
          {
            "x": 1.8333333333333333,
            "y": 1266.3333333333333
          },
          {
            "x": 1.9416666666666669,
            "y": 1286.4166666666667
          },
          {
            "x": 2.05,
            "y": 1306.5
          },
          {
            "x": 2.158333333333333,
            "y": 1326.5833333333333
          },
          {
            "x": 2.2666666666666666,
            "y": 1346.6666666666667
          },
          {
            "x": 2.375,
            "y": 1366.75
          },
          {
            "x": 2.4833333333333334,
            "y": 1386.8333333333333
          },
          {
            "x": 2.591666666666667,
            "y": 1406.9166666666667
          },
          {
            "x": 2.7,
            "y": 1427.0
          },
          {
            "x": 2.7,
            "y": 1427.0
          },
          {
            "x": 2.816666666666667,
            "y": 1449.4166666666667
          },
          {
            "x": 2.9333333333333336,
            "y": 1471.8333333333333
          },
          {
            "x": 3.05,
            "y": 1494.25
          },
          {
            "x": 3.1666666666666665,
            "y": 1516.6666666666667
          },
          {
            "x": 3.283333333333333,
            "y": 1539.0833333333333
          },
          {
            "x": 3.4,
            "y": 1561.5
          },
          {
            "x": 3.5166666666666666,
            "y": 1583.9166666666667
          },
          {
            "x": 3.633333333333333,
            "y": 1606.3333333333333
          },
          {
            "x": 3.75,
            "y": 1628.75
          },
          {
            "x": 3.8666666666666663,
            "y": 1651.1666666666667
          },
          {
            "x": 3.983333333333333,
            "y": 1673.5833333333333
          },
          {
            "x": 4.1,
            "y": 1696.0
          },
          {
            "x": 4.1,
            "y": 1696.0
          },
          {
            "x": 4.207692307692307,
            "y": 1718.076923076923
          },
          {
            "x": 4.315384615384615,
            "y": 1740.1538461538462
          },
          {
            "x": 4.4230769230769225,
            "y": 1762.2307692307693
          },
          {
            "x": 4.530769230769231,
            "y": 1784.3076923076924
          },
          {
            "x": 4.638461538461538,
            "y": 1806.3846153846155
          },
          {
            "x": 4.746153846153846,
            "y": 1828.4615384615386
          },
          {
            "x": 4.8538461538461535,
            "y": 1850.5384615384614
          },
          {
            "x": 4.961538461538462,
            "y": 1872.6153846153845
          },
          {
            "x": 5.069230769230769,
            "y": 1894.6923076923076
          },
          {
            "x": 5.176923076923077,
            "y": 1916.7692307692307
          },
          {
            "x": 5.2846153846153845,
            "y": 1938.8461538461538
          },
          {
            "x": 5.392307692307693,
            "y": 1960.923076923077
          },
          {
            "x": 5.5,
            "y": 1983.0
          },
          {
            "x": 5.5,
            "y": 1983.0
          },
          {
            "x": 5.607692307692307,
            "y": 2006.1538461538462
          },
          {
            "x": 5.7153846153846155,
            "y": 2029.3076923076924
          },
          {
            "x": 5.823076923076923,
            "y": 2052.4615384615386
          },
          {
            "x": 5.930769230769231,
            "y": 2075.6153846153848
          },
          {
            "x": 6.038461538461538,
            "y": 2098.769230769231
          },
          {
            "x": 6.1461538461538465,
            "y": 2121.923076923077
          },
          {
            "x": 6.253846153846154,
            "y": 2145.076923076923
          },
          {
            "x": 6.361538461538462,
            "y": 2168.230769230769
          },
          {
            "x": 6.469230769230769,
            "y": 2191.3846153846152
          },
          {
            "x": 6.5769230769230775,
            "y": 2214.5384615384614
          },
          {
            "x": 6.684615384615385,
            "y": 2237.6923076923076
          },
          {
            "x": 6.792307692307693,
            "y": 2260.846153846154
          },
          {
            "x": 6.9,
            "y": 2284.0
          },
          {
            "x": 6.9,
            "y": 2284.0
          },
          {
            "x": 7.0181818181818185,
            "y": 2312.6363636363635
          },
          {
            "x": 7.136363636363637,
            "y": 2341.2727272727275
          },
          {
            "x": 7.254545454545455,
            "y": 2369.909090909091
          },
          {
            "x": 7.372727272727273,
            "y": 2398.5454545454545
          },
          {
            "x": 7.49090909090909,
            "y": 2427.181818181818
          },
          {
            "x": 7.6090909090909085,
            "y": 2455.818181818182
          },
          {
            "x": 7.727272727272727,
            "y": 2484.4545454545455
          },
          {
            "x": 7.845454545454545,
            "y": 2513.090909090909
          },
          {
            "x": 7.963636363636363,
            "y": 2541.727272727273
          },
          {
            "x": 8.081818181818182,
            "y": 2570.3636363636365
          },
          {
            "x": 8.2,
            "y": 2599.0
          },
          {
            "x": 8.2,
            "y": 2599.0
          },
          {
            "x": 8.307692307692307,
            "y": 2624.0
          },
          {
            "x": 8.415384615384614,
            "y": 2649.0
          },
          {
            "x": 8.523076923076923,
            "y": 2674.0
          },
          {
            "x": 8.63076923076923,
            "y": 2699.0
          },
          {
            "x": 8.738461538461538,
            "y": 2724.0
          },
          {
            "x": 8.846153846153845,
            "y": 2749.0
          },
          {
            "x": 8.953846153846154,
            "y": 2774.0
          },
          {
            "x": 9.061538461538461,
            "y": 2799.0
          },
          {
            "x": 9.169230769230769,
            "y": 2824.0
          },
          {
            "x": 9.276923076923076,
            "y": 2849.0
          },
          {
            "x": 9.384615384615383,
            "y": 2874.0
          },
          {
            "x": 9.492307692307692,
            "y": 2899.0
          },
          {
            "x": 9.6,
            "y": 2924.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1186,
        "time": "07:49"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1427,
        "time": "09:43"
      },
      {
        "name": "中間地点3",
        "distance": 4.1,
        "elevation": 1696,
        "time": "11:37"
      },
      {
        "name": "中間地点4",
        "distance": 5.5,
        "elevation": 1983,
        "time": "13:33"
      },
      {
        "name": "山頂付近5",
        "distance": 6.9,
        "elevation": 2284,
        "time": "15:30"
      },
      {
        "name": "山頂付近6",
        "distance": 8.2,
        "elevation": 2599,
        "time": "17:28"
      },
      {
        "name": "野口五郎岳山頂",
        "distance": 9.6,
        "elevation": 2924,
        "time": "19:26"
      }
    ],
    "stats": {
      "total_distance": 9.6,
      "elevation_gain": 1924,
      "base_elevation": 1000,
      "summit_elevation": 2924
    }
  },
  "薬師岳": {
    "mountain": "薬師岳",
    "datasets": [
      {
        "label": "薬師岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.3076923076923
          },
          {
            "x": 0.2153846153846154,
            "y": 1028.6153846153845
          },
          {
            "x": 0.3230769230769231,
            "y": 1042.923076923077
          },
          {
            "x": 0.4307692307692308,
            "y": 1057.2307692307693
          },
          {
            "x": 0.5384615384615384,
            "y": 1071.5384615384614
          },
          {
            "x": 0.6461538461538462,
            "y": 1085.8461538461538
          },
          {
            "x": 0.7538461538461537,
            "y": 1100.1538461538462
          },
          {
            "x": 0.8615384615384616,
            "y": 1114.4615384615386
          },
          {
            "x": 0.9692307692307691,
            "y": 1128.7692307692307
          },
          {
            "x": 1.0769230769230769,
            "y": 1143.076923076923
          },
          {
            "x": 1.1846153846153846,
            "y": 1157.3846153846155
          },
          {
            "x": 1.2923076923076924,
            "y": 1171.6923076923076
          },
          {
            "x": 1.4,
            "y": 1186.0
          },
          {
            "x": 1.4,
            "y": 1186.0
          },
          {
            "x": 1.5083333333333333,
            "y": 1206.1666666666667
          },
          {
            "x": 1.6166666666666667,
            "y": 1226.3333333333333
          },
          {
            "x": 1.725,
            "y": 1246.5
          },
          {
            "x": 1.8333333333333333,
            "y": 1266.6666666666667
          },
          {
            "x": 1.9416666666666669,
            "y": 1286.8333333333333
          },
          {
            "x": 2.05,
            "y": 1307.0
          },
          {
            "x": 2.158333333333333,
            "y": 1327.1666666666667
          },
          {
            "x": 2.2666666666666666,
            "y": 1347.3333333333333
          },
          {
            "x": 2.375,
            "y": 1367.5
          },
          {
            "x": 2.4833333333333334,
            "y": 1387.6666666666667
          },
          {
            "x": 2.591666666666667,
            "y": 1407.8333333333333
          },
          {
            "x": 2.7,
            "y": 1428.0
          },
          {
            "x": 2.7,
            "y": 1428.0
          },
          {
            "x": 2.816666666666667,
            "y": 1450.3333333333333
          },
          {
            "x": 2.9333333333333336,
            "y": 1472.6666666666667
          },
          {
            "x": 3.05,
            "y": 1495.0
          },
          {
            "x": 3.1666666666666665,
            "y": 1517.3333333333333
          },
          {
            "x": 3.283333333333333,
            "y": 1539.6666666666667
          },
          {
            "x": 3.4,
            "y": 1562.0
          },
          {
            "x": 3.5166666666666666,
            "y": 1584.3333333333333
          },
          {
            "x": 3.633333333333333,
            "y": 1606.6666666666667
          },
          {
            "x": 3.75,
            "y": 1629.0
          },
          {
            "x": 3.8666666666666663,
            "y": 1651.3333333333333
          },
          {
            "x": 3.983333333333333,
            "y": 1673.6666666666667
          },
          {
            "x": 4.1,
            "y": 1696.0
          },
          {
            "x": 4.1,
            "y": 1696.0
          },
          {
            "x": 4.207692307692307,
            "y": 1718.1538461538462
          },
          {
            "x": 4.315384615384615,
            "y": 1740.3076923076924
          },
          {
            "x": 4.4230769230769225,
            "y": 1762.4615384615386
          },
          {
            "x": 4.530769230769231,
            "y": 1784.6153846153845
          },
          {
            "x": 4.638461538461538,
            "y": 1806.7692307692307
          },
          {
            "x": 4.746153846153846,
            "y": 1828.923076923077
          },
          {
            "x": 4.8538461538461535,
            "y": 1851.076923076923
          },
          {
            "x": 4.961538461538462,
            "y": 1873.2307692307693
          },
          {
            "x": 5.069230769230769,
            "y": 1895.3846153846155
          },
          {
            "x": 5.176923076923077,
            "y": 1917.5384615384614
          },
          {
            "x": 5.2846153846153845,
            "y": 1939.6923076923076
          },
          {
            "x": 5.392307692307693,
            "y": 1961.8461538461538
          },
          {
            "x": 5.5,
            "y": 1984.0
          },
          {
            "x": 5.5,
            "y": 1984.0
          },
          {
            "x": 5.607692307692307,
            "y": 2007.2307692307693
          },
          {
            "x": 5.7153846153846155,
            "y": 2030.4615384615386
          },
          {
            "x": 5.823076923076923,
            "y": 2053.6923076923076
          },
          {
            "x": 5.930769230769231,
            "y": 2076.923076923077
          },
          {
            "x": 6.038461538461538,
            "y": 2100.153846153846
          },
          {
            "x": 6.1461538461538465,
            "y": 2123.3846153846152
          },
          {
            "x": 6.253846153846154,
            "y": 2146.6153846153848
          },
          {
            "x": 6.361538461538462,
            "y": 2169.846153846154
          },
          {
            "x": 6.469230769230769,
            "y": 2193.076923076923
          },
          {
            "x": 6.5769230769230775,
            "y": 2216.3076923076924
          },
          {
            "x": 6.684615384615385,
            "y": 2239.5384615384614
          },
          {
            "x": 6.792307692307693,
            "y": 2262.769230769231
          },
          {
            "x": 6.9,
            "y": 2286.0
          },
          {
            "x": 6.9,
            "y": 2286.0
          },
          {
            "x": 7.0181818181818185,
            "y": 2314.5454545454545
          },
          {
            "x": 7.136363636363637,
            "y": 2343.090909090909
          },
          {
            "x": 7.254545454545455,
            "y": 2371.6363636363635
          },
          {
            "x": 7.372727272727273,
            "y": 2400.181818181818
          },
          {
            "x": 7.49090909090909,
            "y": 2428.7272727272725
          },
          {
            "x": 7.6090909090909085,
            "y": 2457.272727272727
          },
          {
            "x": 7.727272727272727,
            "y": 2485.818181818182
          },
          {
            "x": 7.845454545454545,
            "y": 2514.3636363636365
          },
          {
            "x": 7.963636363636363,
            "y": 2542.909090909091
          },
          {
            "x": 8.081818181818182,
            "y": 2571.4545454545455
          },
          {
            "x": 8.2,
            "y": 2600.0
          },
          {
            "x": 8.2,
            "y": 2600.0
          },
          {
            "x": 8.307692307692307,
            "y": 2625.076923076923
          },
          {
            "x": 8.415384615384614,
            "y": 2650.153846153846
          },
          {
            "x": 8.523076923076923,
            "y": 2675.230769230769
          },
          {
            "x": 8.63076923076923,
            "y": 2700.3076923076924
          },
          {
            "x": 8.738461538461538,
            "y": 2725.3846153846152
          },
          {
            "x": 8.846153846153845,
            "y": 2750.4615384615386
          },
          {
            "x": 8.953846153846154,
            "y": 2775.5384615384614
          },
          {
            "x": 9.061538461538461,
            "y": 2800.6153846153848
          },
          {
            "x": 9.169230769230769,
            "y": 2825.6923076923076
          },
          {
            "x": 9.276923076923076,
            "y": 2850.769230769231
          },
          {
            "x": 9.384615384615383,
            "y": 2875.846153846154
          },
          {
            "x": 9.492307692307692,
            "y": 2900.923076923077
          },
          {
            "x": 9.6,
            "y": 2926.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1186,
        "time": "07:49"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1428,
        "time": "09:43"
      },
      {
        "name": "中間地点3",
        "distance": 4.1,
        "elevation": 1696,
        "time": "11:37"
      },
      {
        "name": "中間地点4",
        "distance": 5.5,
        "elevation": 1984,
        "time": "13:34"
      },
      {
        "name": "山頂付近5",
        "distance": 6.9,
        "elevation": 2286,
        "time": "15:30"
      },
      {
        "name": "山頂付近6",
        "distance": 8.2,
        "elevation": 2600,
        "time": "17:28"
      },
      {
        "name": "薬師岳山頂",
        "distance": 9.6,
        "elevation": 2926,
        "time": "19:26"
      }
    ],
    "stats": {
      "total_distance": 9.6,
      "elevation_gain": 1926,
      "base_elevation": 1000,
      "summit_elevation": 2926
    }
  },
  "黒部五郎岳": {
    "mountain": "黒部五郎岳",
    "datasets": [
      {
        "label": "黒部五郎岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1014.8333333333334
          },
          {
            "x": 0.21666666666666667,
            "y": 1029.6666666666667
          },
          {
            "x": 0.325,
            "y": 1044.5
          },
          {
            "x": 0.43333333333333335,
            "y": 1059.3333333333333
          },
          {
            "x": 0.5416666666666667,
            "y": 1074.1666666666667
          },
          {
            "x": 0.65,
            "y": 1089.0
          },
          {
            "x": 0.7583333333333334,
            "y": 1103.8333333333333
          },
          {
            "x": 0.8666666666666667,
            "y": 1118.6666666666667
          },
          {
            "x": 0.9750000000000001,
            "y": 1133.5
          },
          {
            "x": 1.0833333333333335,
            "y": 1148.3333333333333
          },
          {
            "x": 1.1916666666666667,
            "y": 1163.1666666666667
          },
          {
            "x": 1.3,
            "y": 1178.0
          },
          {
            "x": 1.3,
            "y": 1178.0
          },
          {
            "x": 1.4083333333333334,
            "y": 1197.25
          },
          {
            "x": 1.5166666666666666,
            "y": 1216.5
          },
          {
            "x": 1.625,
            "y": 1235.75
          },
          {
            "x": 1.7333333333333334,
            "y": 1255.0
          },
          {
            "x": 1.8416666666666668,
            "y": 1274.25
          },
          {
            "x": 1.9500000000000002,
            "y": 1293.5
          },
          {
            "x": 2.0583333333333336,
            "y": 1312.75
          },
          {
            "x": 2.166666666666667,
            "y": 1332.0
          },
          {
            "x": 2.2750000000000004,
            "y": 1351.25
          },
          {
            "x": 2.3833333333333337,
            "y": 1370.5
          },
          {
            "x": 2.4916666666666667,
            "y": 1389.75
          },
          {
            "x": 2.6,
            "y": 1409.0
          },
          {
            "x": 2.6,
            "y": 1409.0
          },
          {
            "x": 2.7181818181818183,
            "y": 1432.2727272727273
          },
          {
            "x": 2.8363636363636364,
            "y": 1455.5454545454545
          },
          {
            "x": 2.9545454545454546,
            "y": 1478.8181818181818
          },
          {
            "x": 3.0727272727272728,
            "y": 1502.090909090909
          },
          {
            "x": 3.190909090909091,
            "y": 1525.3636363636363
          },
          {
            "x": 3.309090909090909,
            "y": 1548.6363636363635
          },
          {
            "x": 3.4272727272727272,
            "y": 1571.909090909091
          },
          {
            "x": 3.5454545454545454,
            "y": 1595.1818181818182
          },
          {
            "x": 3.6636363636363636,
            "y": 1618.4545454545455
          },
          {
            "x": 3.7818181818181817,
            "y": 1641.7272727272727
          },
          {
            "x": 3.9,
            "y": 1665.0
          },
          {
            "x": 3.9,
            "y": 1665.0
          },
          {
            "x": 4.007692307692308,
            "y": 1686.1538461538462
          },
          {
            "x": 4.115384615384615,
            "y": 1707.3076923076924
          },
          {
            "x": 4.223076923076923,
            "y": 1728.4615384615386
          },
          {
            "x": 4.3307692307692305,
            "y": 1749.6153846153845
          },
          {
            "x": 4.438461538461539,
            "y": 1770.7692307692307
          },
          {
            "x": 4.546153846153846,
            "y": 1791.923076923077
          },
          {
            "x": 4.653846153846153,
            "y": 1813.076923076923
          },
          {
            "x": 4.7615384615384615,
            "y": 1834.2307692307693
          },
          {
            "x": 4.869230769230769,
            "y": 1855.3846153846155
          },
          {
            "x": 4.976923076923077,
            "y": 1876.5384615384614
          },
          {
            "x": 5.084615384615384,
            "y": 1897.6923076923076
          },
          {
            "x": 5.1923076923076925,
            "y": 1918.8461538461538
          },
          {
            "x": 5.3,
            "y": 1940.0
          },
          {
            "x": 5.3,
            "y": 1940.0
          },
          {
            "x": 5.418181818181818,
            "y": 1966.1818181818182
          },
          {
            "x": 5.536363636363636,
            "y": 1992.3636363636363
          },
          {
            "x": 5.654545454545454,
            "y": 2018.5454545454545
          },
          {
            "x": 5.7727272727272725,
            "y": 2044.7272727272727
          },
          {
            "x": 5.890909090909091,
            "y": 2070.909090909091
          },
          {
            "x": 6.009090909090909,
            "y": 2097.090909090909
          },
          {
            "x": 6.127272727272727,
            "y": 2123.2727272727275
          },
          {
            "x": 6.245454545454545,
            "y": 2149.4545454545455
          },
          {
            "x": 6.363636363636363,
            "y": 2175.6363636363635
          },
          {
            "x": 6.4818181818181815,
            "y": 2201.818181818182
          },
          {
            "x": 6.6,
            "y": 2228.0
          },
          {
            "x": 6.6,
            "y": 2228.0
          },
          {
            "x": 6.708333333333333,
            "y": 2253.0833333333335
          },
          {
            "x": 6.816666666666666,
            "y": 2278.1666666666665
          },
          {
            "x": 6.925,
            "y": 2303.25
          },
          {
            "x": 7.033333333333333,
            "y": 2328.3333333333335
          },
          {
            "x": 7.141666666666667,
            "y": 2353.4166666666665
          },
          {
            "x": 7.25,
            "y": 2378.5
          },
          {
            "x": 7.358333333333333,
            "y": 2403.5833333333335
          },
          {
            "x": 7.466666666666667,
            "y": 2428.6666666666665
          },
          {
            "x": 7.575,
            "y": 2453.75
          },
          {
            "x": 7.683333333333334,
            "y": 2478.8333333333335
          },
          {
            "x": 7.791666666666667,
            "y": 2503.9166666666665
          },
          {
            "x": 7.9,
            "y": 2529.0
          },
          {
            "x": 7.9,
            "y": 2529.0
          },
          {
            "x": 8.018181818181818,
            "y": 2557.2727272727275
          },
          {
            "x": 8.136363636363637,
            "y": 2585.5454545454545
          },
          {
            "x": 8.254545454545454,
            "y": 2613.818181818182
          },
          {
            "x": 8.372727272727273,
            "y": 2642.090909090909
          },
          {
            "x": 8.49090909090909,
            "y": 2670.3636363636365
          },
          {
            "x": 8.60909090909091,
            "y": 2698.6363636363635
          },
          {
            "x": 8.727272727272727,
            "y": 2726.909090909091
          },
          {
            "x": 8.845454545454546,
            "y": 2755.181818181818
          },
          {
            "x": 8.963636363636363,
            "y": 2783.4545454545455
          },
          {
            "x": 9.081818181818182,
            "y": 2811.7272727272725
          },
          {
            "x": 9.2,
            "y": 2840.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1178,
        "time": "07:45"
      },
      {
        "name": "登山道2合目",
        "distance": 2.6,
        "elevation": 1409,
        "time": "09:33"
      },
      {
        "name": "中間地点3",
        "distance": 3.9,
        "elevation": 1665,
        "time": "11:23"
      },
      {
        "name": "中間地点4",
        "distance": 5.3,
        "elevation": 1940,
        "time": "13:14"
      },
      {
        "name": "山頂付近5",
        "distance": 6.6,
        "elevation": 2228,
        "time": "15:06"
      },
      {
        "name": "山頂付近6",
        "distance": 7.9,
        "elevation": 2529,
        "time": "16:59"
      },
      {
        "name": "黒部五郎岳山頂",
        "distance": 9.2,
        "elevation": 2840,
        "time": "18:52"
      }
    ],
    "stats": {
      "total_distance": 9.2,
      "elevation_gain": 1840,
      "base_elevation": 1000,
      "summit_elevation": 2840
    }
  },
  "笠ヶ岳": {
    "mountain": "笠ヶ岳",
    "datasets": [
      {
        "label": "笠ヶ岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.0769230769231
          },
          {
            "x": 0.2153846153846154,
            "y": 1028.1538461538462
          },
          {
            "x": 0.3230769230769231,
            "y": 1042.2307692307693
          },
          {
            "x": 0.4307692307692308,
            "y": 1056.3076923076924
          },
          {
            "x": 0.5384615384615384,
            "y": 1070.3846153846155
          },
          {
            "x": 0.6461538461538462,
            "y": 1084.4615384615386
          },
          {
            "x": 0.7538461538461537,
            "y": 1098.5384615384614
          },
          {
            "x": 0.8615384615384616,
            "y": 1112.6153846153845
          },
          {
            "x": 0.9692307692307691,
            "y": 1126.6923076923076
          },
          {
            "x": 1.0769230769230769,
            "y": 1140.7692307692307
          },
          {
            "x": 1.1846153846153846,
            "y": 1154.8461538461538
          },
          {
            "x": 1.2923076923076924,
            "y": 1168.923076923077
          },
          {
            "x": 1.4,
            "y": 1183.0
          },
          {
            "x": 1.4,
            "y": 1183.0
          },
          {
            "x": 1.5083333333333333,
            "y": 1202.9166666666667
          },
          {
            "x": 1.6166666666666667,
            "y": 1222.8333333333333
          },
          {
            "x": 1.725,
            "y": 1242.75
          },
          {
            "x": 1.8333333333333333,
            "y": 1262.6666666666667
          },
          {
            "x": 1.9416666666666669,
            "y": 1282.5833333333333
          },
          {
            "x": 2.05,
            "y": 1302.5
          },
          {
            "x": 2.158333333333333,
            "y": 1322.4166666666667
          },
          {
            "x": 2.2666666666666666,
            "y": 1342.3333333333333
          },
          {
            "x": 2.375,
            "y": 1362.25
          },
          {
            "x": 2.4833333333333334,
            "y": 1382.1666666666667
          },
          {
            "x": 2.591666666666667,
            "y": 1402.0833333333333
          },
          {
            "x": 2.7,
            "y": 1422.0
          },
          {
            "x": 2.7,
            "y": 1422.0
          },
          {
            "x": 2.816666666666667,
            "y": 1444.0
          },
          {
            "x": 2.9333333333333336,
            "y": 1466.0
          },
          {
            "x": 3.05,
            "y": 1488.0
          },
          {
            "x": 3.1666666666666665,
            "y": 1510.0
          },
          {
            "x": 3.283333333333333,
            "y": 1532.0
          },
          {
            "x": 3.4,
            "y": 1554.0
          },
          {
            "x": 3.5166666666666666,
            "y": 1576.0
          },
          {
            "x": 3.633333333333333,
            "y": 1598.0
          },
          {
            "x": 3.75,
            "y": 1620.0
          },
          {
            "x": 3.8666666666666663,
            "y": 1642.0
          },
          {
            "x": 3.983333333333333,
            "y": 1664.0
          },
          {
            "x": 4.1,
            "y": 1686.0
          },
          {
            "x": 4.1,
            "y": 1686.0
          },
          {
            "x": 4.208333333333333,
            "y": 1709.5833333333333
          },
          {
            "x": 4.316666666666666,
            "y": 1733.1666666666667
          },
          {
            "x": 4.425,
            "y": 1756.75
          },
          {
            "x": 4.533333333333333,
            "y": 1780.3333333333333
          },
          {
            "x": 4.641666666666667,
            "y": 1803.9166666666667
          },
          {
            "x": 4.75,
            "y": 1827.5
          },
          {
            "x": 4.858333333333333,
            "y": 1851.0833333333333
          },
          {
            "x": 4.966666666666667,
            "y": 1874.6666666666667
          },
          {
            "x": 5.075,
            "y": 1898.25
          },
          {
            "x": 5.183333333333334,
            "y": 1921.8333333333333
          },
          {
            "x": 5.291666666666667,
            "y": 1945.4166666666665
          },
          {
            "x": 5.4,
            "y": 1969.0
          },
          {
            "x": 5.4,
            "y": 1969.0
          },
          {
            "x": 5.516666666666667,
            "y": 1993.8333333333333
          },
          {
            "x": 5.633333333333334,
            "y": 2018.6666666666667
          },
          {
            "x": 5.75,
            "y": 2043.5
          },
          {
            "x": 5.866666666666667,
            "y": 2068.3333333333335
          },
          {
            "x": 5.983333333333333,
            "y": 2093.1666666666665
          },
          {
            "x": 6.1,
            "y": 2118.0
          },
          {
            "x": 6.216666666666667,
            "y": 2142.8333333333335
          },
          {
            "x": 6.333333333333333,
            "y": 2167.6666666666665
          },
          {
            "x": 6.45,
            "y": 2192.5
          },
          {
            "x": 6.566666666666666,
            "y": 2217.3333333333335
          },
          {
            "x": 6.683333333333334,
            "y": 2242.1666666666665
          },
          {
            "x": 6.8,
            "y": 2267.0
          },
          {
            "x": 6.8,
            "y": 2267.0
          },
          {
            "x": 6.918181818181818,
            "y": 2295.181818181818
          },
          {
            "x": 7.036363636363636,
            "y": 2323.3636363636365
          },
          {
            "x": 7.154545454545454,
            "y": 2351.5454545454545
          },
          {
            "x": 7.2727272727272725,
            "y": 2379.7272727272725
          },
          {
            "x": 7.390909090909091,
            "y": 2407.909090909091
          },
          {
            "x": 7.509090909090909,
            "y": 2436.090909090909
          },
          {
            "x": 7.627272727272727,
            "y": 2464.2727272727275
          },
          {
            "x": 7.745454545454545,
            "y": 2492.4545454545455
          },
          {
            "x": 7.863636363636363,
            "y": 2520.6363636363635
          },
          {
            "x": 7.9818181818181815,
            "y": 2548.818181818182
          },
          {
            "x": 8.1,
            "y": 2577.0
          },
          {
            "x": 8.1,
            "y": 2577.0
          },
          {
            "x": 8.207692307692307,
            "y": 2601.6923076923076
          },
          {
            "x": 8.315384615384614,
            "y": 2626.3846153846152
          },
          {
            "x": 8.423076923076923,
            "y": 2651.076923076923
          },
          {
            "x": 8.53076923076923,
            "y": 2675.769230769231
          },
          {
            "x": 8.638461538461538,
            "y": 2700.4615384615386
          },
          {
            "x": 8.746153846153845,
            "y": 2725.153846153846
          },
          {
            "x": 8.853846153846154,
            "y": 2749.846153846154
          },
          {
            "x": 8.961538461538462,
            "y": 2774.5384615384614
          },
          {
            "x": 9.069230769230769,
            "y": 2799.230769230769
          },
          {
            "x": 9.176923076923076,
            "y": 2823.923076923077
          },
          {
            "x": 9.284615384615385,
            "y": 2848.6153846153848
          },
          {
            "x": 9.392307692307693,
            "y": 2873.3076923076924
          },
          {
            "x": 9.5,
            "y": 2898.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1183,
        "time": "07:48"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1422,
        "time": "09:40"
      },
      {
        "name": "中間地点3",
        "distance": 4.1,
        "elevation": 1686,
        "time": "11:34"
      },
      {
        "name": "中間地点4",
        "distance": 5.4,
        "elevation": 1969,
        "time": "13:28"
      },
      {
        "name": "山頂付近5",
        "distance": 6.8,
        "elevation": 2267,
        "time": "15:24"
      },
      {
        "name": "山頂付近6",
        "distance": 8.1,
        "elevation": 2577,
        "time": "17:20"
      },
      {
        "name": "笠ヶ岳山頂",
        "distance": 9.5,
        "elevation": 2898,
        "time": "19:17"
      }
    ],
    "stats": {
      "total_distance": 9.5,
      "elevation_gain": 1898,
      "base_elevation": 1000,
      "summit_elevation": 2898
    }
  },
  "焼岳": {
    "mountain": "焼岳",
    "datasets": [
      {
        "label": "焼岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1111111111111111,
            "y": 1015.5555555555555
          },
          {
            "x": 0.2222222222222222,
            "y": 1031.111111111111
          },
          {
            "x": 0.3333333333333333,
            "y": 1046.6666666666667
          },
          {
            "x": 0.4444444444444444,
            "y": 1062.2222222222222
          },
          {
            "x": 0.5555555555555556,
            "y": 1077.7777777777778
          },
          {
            "x": 0.6666666666666666,
            "y": 1093.3333333333333
          },
          {
            "x": 0.7777777777777778,
            "y": 1108.888888888889
          },
          {
            "x": 0.8888888888888888,
            "y": 1124.4444444444443
          },
          {
            "x": 1.0,
            "y": 1140.0
          },
          {
            "x": 1.0,
            "y": 1140.0
          },
          {
            "x": 1.11,
            "y": 1158.3
          },
          {
            "x": 1.22,
            "y": 1176.6
          },
          {
            "x": 1.33,
            "y": 1194.9
          },
          {
            "x": 1.44,
            "y": 1213.2
          },
          {
            "x": 1.55,
            "y": 1231.5
          },
          {
            "x": 1.6600000000000001,
            "y": 1249.8
          },
          {
            "x": 1.77,
            "y": 1268.1
          },
          {
            "x": 1.8800000000000001,
            "y": 1286.4
          },
          {
            "x": 1.9900000000000002,
            "y": 1304.7
          },
          {
            "x": 2.1,
            "y": 1323.0
          },
          {
            "x": 2.1,
            "y": 1323.0
          },
          {
            "x": 2.2111111111111112,
            "y": 1345.5555555555557
          },
          {
            "x": 2.3222222222222224,
            "y": 1368.111111111111
          },
          {
            "x": 2.4333333333333336,
            "y": 1390.6666666666667
          },
          {
            "x": 2.5444444444444443,
            "y": 1413.2222222222222
          },
          {
            "x": 2.655555555555556,
            "y": 1435.7777777777778
          },
          {
            "x": 2.7666666666666666,
            "y": 1458.3333333333333
          },
          {
            "x": 2.8777777777777778,
            "y": 1480.888888888889
          },
          {
            "x": 2.988888888888889,
            "y": 1503.4444444444443
          },
          {
            "x": 3.1,
            "y": 1526.0
          },
          {
            "x": 3.1,
            "y": 1526.0
          },
          {
            "x": 3.21,
            "y": 1547.7
          },
          {
            "x": 3.3200000000000003,
            "y": 1569.4
          },
          {
            "x": 3.43,
            "y": 1591.1
          },
          {
            "x": 3.54,
            "y": 1612.8
          },
          {
            "x": 3.6500000000000004,
            "y": 1634.5
          },
          {
            "x": 3.7600000000000002,
            "y": 1656.2
          },
          {
            "x": 3.87,
            "y": 1677.9
          },
          {
            "x": 3.9800000000000004,
            "y": 1699.6
          },
          {
            "x": 4.09,
            "y": 1721.3
          },
          {
            "x": 4.2,
            "y": 1743.0
          },
          {
            "x": 4.2,
            "y": 1743.0
          },
          {
            "x": 4.311111111111111,
            "y": 1768.3333333333333
          },
          {
            "x": 4.4222222222222225,
            "y": 1793.6666666666667
          },
          {
            "x": 4.533333333333333,
            "y": 1819.0
          },
          {
            "x": 4.644444444444445,
            "y": 1844.3333333333333
          },
          {
            "x": 4.7555555555555555,
            "y": 1869.6666666666667
          },
          {
            "x": 4.866666666666667,
            "y": 1895.0
          },
          {
            "x": 4.977777777777778,
            "y": 1920.3333333333333
          },
          {
            "x": 5.088888888888889,
            "y": 1945.6666666666667
          },
          {
            "x": 5.2,
            "y": 1971.0
          },
          {
            "x": 5.2,
            "y": 1971.0
          },
          {
            "x": 5.322222222222222,
            "y": 1997.4444444444443
          },
          {
            "x": 5.444444444444445,
            "y": 2023.888888888889
          },
          {
            "x": 5.566666666666666,
            "y": 2050.3333333333335
          },
          {
            "x": 5.688888888888889,
            "y": 2076.777777777778
          },
          {
            "x": 5.811111111111111,
            "y": 2103.222222222222
          },
          {
            "x": 5.933333333333334,
            "y": 2129.6666666666665
          },
          {
            "x": 6.055555555555555,
            "y": 2156.1111111111113
          },
          {
            "x": 6.177777777777777,
            "y": 2182.5555555555557
          },
          {
            "x": 6.3,
            "y": 2209.0
          },
          {
            "x": 6.3,
            "y": 2209.0
          },
          {
            "x": 6.4111111111111105,
            "y": 2236.3333333333335
          },
          {
            "x": 6.522222222222222,
            "y": 2263.6666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2291.0
          },
          {
            "x": 6.7444444444444445,
            "y": 2318.3333333333335
          },
          {
            "x": 6.855555555555555,
            "y": 2345.6666666666665
          },
          {
            "x": 6.966666666666667,
            "y": 2373.0
          },
          {
            "x": 7.0777777777777775,
            "y": 2400.3333333333335
          },
          {
            "x": 7.188888888888888,
            "y": 2427.6666666666665
          },
          {
            "x": 7.3,
            "y": 2455.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.0,
        "elevation": 1140,
        "time": "07:23"
      },
      {
        "name": "登山道2合目",
        "distance": 2.1,
        "elevation": 1323,
        "time": "08:49"
      },
      {
        "name": "中間地点3",
        "distance": 3.1,
        "elevation": 1526,
        "time": "10:16"
      },
      {
        "name": "中間地点4",
        "distance": 4.2,
        "elevation": 1743,
        "time": "11:44"
      },
      {
        "name": "山頂付近5",
        "distance": 5.2,
        "elevation": 1971,
        "time": "13:13"
      },
      {
        "name": "山頂付近6",
        "distance": 6.3,
        "elevation": 2209,
        "time": "14:43"
      },
      {
        "name": "焼岳山頂",
        "distance": 7.3,
        "elevation": 2455,
        "time": "16:12"
      }
    ],
    "stats": {
      "total_distance": 7.3,
      "elevation_gain": 1455,
      "base_elevation": 1000,
      "summit_elevation": 2455
    }
  },
  "乗鞍岳": {
    "mountain": "乗鞍岳",
    "datasets": [
      {
        "label": "乗鞍岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1026.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1040.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1055.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1070.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1085.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1100.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1115.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1129.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1144.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1159.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1174.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1189.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1204.1538461538462
          },
          {
            "x": 1.4,
            "y": 1219.0
          },
          {
            "x": 1.4,
            "y": 1219.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1236.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1254.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1272.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1290.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1308.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1326.5714285714287
          },
          {
            "x": 2.15,
            "y": 1344.5
          },
          {
            "x": 2.257142857142857,
            "y": 1362.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1380.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1398.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1416.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1434.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1452.0714285714287
          },
          {
            "x": 2.9,
            "y": 1470.0
          },
          {
            "x": 2.9,
            "y": 1470.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1491.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1512.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1534.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1555.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1577.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1598.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1620.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1641.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1663.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1684.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1706.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1727.5384615384614
          },
          {
            "x": 4.3,
            "y": 1749.0
          },
          {
            "x": 4.3,
            "y": 1749.0
          },
          {
            "x": 4.407692307692307,
            "y": 1771.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1794.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1817.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1840.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1863.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1886.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1909.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 1932.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 1955.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 1978.2307692307693
          },
          {
            "x": 5.484615384615385,
            "y": 2001.1538461538462
          },
          {
            "x": 5.592307692307692,
            "y": 2024.076923076923
          },
          {
            "x": 5.7,
            "y": 2047.0
          },
          {
            "x": 5.7,
            "y": 2047.0
          },
          {
            "x": 5.816666666666666,
            "y": 2073.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2099.3333333333335
          },
          {
            "x": 6.05,
            "y": 2125.5
          },
          {
            "x": 6.166666666666667,
            "y": 2151.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2177.8333333333335
          },
          {
            "x": 6.4,
            "y": 2204.0
          },
          {
            "x": 6.516666666666667,
            "y": 2230.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2256.3333333333335
          },
          {
            "x": 6.75,
            "y": 2282.5
          },
          {
            "x": 6.866666666666666,
            "y": 2308.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2334.8333333333335
          },
          {
            "x": 7.1,
            "y": 2361.0
          },
          {
            "x": 7.1,
            "y": 2361.0
          },
          {
            "x": 7.207142857142856,
            "y": 2384.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2407.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2431.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2454.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2477.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2501.1428571428573
          },
          {
            "x": 7.85,
            "y": 2524.5
          },
          {
            "x": 7.957142857142856,
            "y": 2547.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2571.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2594.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2617.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2641.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2664.6428571428573
          },
          {
            "x": 8.6,
            "y": 2688.0
          },
          {
            "x": 8.6,
            "y": 2688.0
          },
          {
            "x": 8.707692307692307,
            "y": 2714.0
          },
          {
            "x": 8.815384615384614,
            "y": 2740.0
          },
          {
            "x": 8.923076923076923,
            "y": 2766.0
          },
          {
            "x": 9.03076923076923,
            "y": 2792.0
          },
          {
            "x": 9.138461538461538,
            "y": 2818.0
          },
          {
            "x": 9.246153846153845,
            "y": 2844.0
          },
          {
            "x": 9.353846153846154,
            "y": 2870.0
          },
          {
            "x": 9.461538461538462,
            "y": 2896.0
          },
          {
            "x": 9.569230769230769,
            "y": 2922.0
          },
          {
            "x": 9.676923076923076,
            "y": 2948.0
          },
          {
            "x": 9.784615384615385,
            "y": 2974.0
          },
          {
            "x": 9.892307692307693,
            "y": 3000.0
          },
          {
            "x": 10.0,
            "y": 3026.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1026,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1219,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1470,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1749,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2047,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2361,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2688,
        "time": "17:56"
      },
      {
        "name": "乗鞍岳山頂",
        "distance": 10.0,
        "elevation": 3026,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1026,
      "summit_elevation": 3026
    }
  },
  "御嶽山": {
    "mountain": "御嶽山",
    "datasets": [
      {
        "label": "御嶽山 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1067.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1081.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1096.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1111.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1126.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1141.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1156.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1170.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1185.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1200.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1215.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1230.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1245.1538461538462
          },
          {
            "x": 1.4,
            "y": 1260.0
          },
          {
            "x": 1.4,
            "y": 1260.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1277.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1295.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1313.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1331.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1349.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1367.5714285714287
          },
          {
            "x": 2.15,
            "y": 1385.5
          },
          {
            "x": 2.257142857142857,
            "y": 1403.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1421.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1439.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1457.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1475.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1493.0714285714287
          },
          {
            "x": 2.9,
            "y": 1511.0
          },
          {
            "x": 2.9,
            "y": 1511.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1532.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1553.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1575.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1596.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1618.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1639.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1661.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1682.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1704.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1725.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1747.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1768.5384615384614
          },
          {
            "x": 4.3,
            "y": 1790.0
          },
          {
            "x": 4.3,
            "y": 1790.0
          },
          {
            "x": 4.407692307692307,
            "y": 1812.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1835.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1858.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1881.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1904.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1927.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1950.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 1973.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 1996.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 2019.2307692307693
          },
          {
            "x": 5.484615384615385,
            "y": 2042.1538461538462
          },
          {
            "x": 5.592307692307692,
            "y": 2065.076923076923
          },
          {
            "x": 5.7,
            "y": 2088.0
          },
          {
            "x": 5.7,
            "y": 2088.0
          },
          {
            "x": 5.816666666666666,
            "y": 2114.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2140.3333333333335
          },
          {
            "x": 6.05,
            "y": 2166.5
          },
          {
            "x": 6.166666666666667,
            "y": 2192.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2218.8333333333335
          },
          {
            "x": 6.4,
            "y": 2245.0
          },
          {
            "x": 6.516666666666667,
            "y": 2271.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2297.3333333333335
          },
          {
            "x": 6.75,
            "y": 2323.5
          },
          {
            "x": 6.866666666666666,
            "y": 2349.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2375.8333333333335
          },
          {
            "x": 7.1,
            "y": 2402.0
          },
          {
            "x": 7.1,
            "y": 2402.0
          },
          {
            "x": 7.207142857142856,
            "y": 2425.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2448.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2472.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2495.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2518.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2542.1428571428573
          },
          {
            "x": 7.85,
            "y": 2565.5
          },
          {
            "x": 7.957142857142856,
            "y": 2588.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2612.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2635.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2658.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2682.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2705.6428571428573
          },
          {
            "x": 8.6,
            "y": 2729.0
          },
          {
            "x": 8.6,
            "y": 2729.0
          },
          {
            "x": 8.707692307692307,
            "y": 2755.0
          },
          {
            "x": 8.815384615384614,
            "y": 2781.0
          },
          {
            "x": 8.923076923076923,
            "y": 2807.0
          },
          {
            "x": 9.03076923076923,
            "y": 2833.0
          },
          {
            "x": 9.138461538461538,
            "y": 2859.0
          },
          {
            "x": 9.246153846153845,
            "y": 2885.0
          },
          {
            "x": 9.353846153846154,
            "y": 2911.0
          },
          {
            "x": 9.461538461538462,
            "y": 2937.0
          },
          {
            "x": 9.569230769230769,
            "y": 2963.0
          },
          {
            "x": 9.676923076923076,
            "y": 2989.0
          },
          {
            "x": 9.784615384615385,
            "y": 3015.0
          },
          {
            "x": 9.892307692307693,
            "y": 3041.0
          },
          {
            "x": 10.0,
            "y": 3067.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1067,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1260,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1511,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1790,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2088,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2402,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2729,
        "time": "17:56"
      },
      {
        "name": "御嶽山山頂",
        "distance": 10.0,
        "elevation": 3067,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1067,
      "summit_elevation": 3067
    }
  },
  "白馬岳": {
    "mountain": "白馬岳",
    "datasets": [
      {
        "label": "白馬岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.3846153846154
          },
          {
            "x": 0.2153846153846154,
            "y": 1028.7692307692307
          },
          {
            "x": 0.3230769230769231,
            "y": 1043.1538461538462
          },
          {
            "x": 0.4307692307692308,
            "y": 1057.5384615384614
          },
          {
            "x": 0.5384615384615384,
            "y": 1071.923076923077
          },
          {
            "x": 0.6461538461538462,
            "y": 1086.3076923076924
          },
          {
            "x": 0.7538461538461537,
            "y": 1100.6923076923076
          },
          {
            "x": 0.8615384615384616,
            "y": 1115.076923076923
          },
          {
            "x": 0.9692307692307691,
            "y": 1129.4615384615386
          },
          {
            "x": 1.0769230769230769,
            "y": 1143.8461538461538
          },
          {
            "x": 1.1846153846153846,
            "y": 1158.2307692307693
          },
          {
            "x": 1.2923076923076924,
            "y": 1172.6153846153845
          },
          {
            "x": 1.4,
            "y": 1187.0
          },
          {
            "x": 1.4,
            "y": 1187.0
          },
          {
            "x": 1.5076923076923077,
            "y": 1205.6153846153845
          },
          {
            "x": 1.6153846153846154,
            "y": 1224.2307692307693
          },
          {
            "x": 1.723076923076923,
            "y": 1242.8461538461538
          },
          {
            "x": 1.8307692307692307,
            "y": 1261.4615384615386
          },
          {
            "x": 1.9384615384615382,
            "y": 1280.076923076923
          },
          {
            "x": 2.046153846153846,
            "y": 1298.6923076923076
          },
          {
            "x": 2.1538461538461537,
            "y": 1317.3076923076924
          },
          {
            "x": 2.2615384615384615,
            "y": 1335.923076923077
          },
          {
            "x": 2.369230769230769,
            "y": 1354.5384615384614
          },
          {
            "x": 2.476923076923077,
            "y": 1373.1538461538462
          },
          {
            "x": 2.5846153846153843,
            "y": 1391.7692307692307
          },
          {
            "x": 2.6923076923076925,
            "y": 1410.3846153846155
          },
          {
            "x": 2.8,
            "y": 1429.0
          },
          {
            "x": 2.8,
            "y": 1429.0
          },
          {
            "x": 2.9076923076923076,
            "y": 1449.6923076923076
          },
          {
            "x": 3.0153846153846153,
            "y": 1470.3846153846155
          },
          {
            "x": 3.123076923076923,
            "y": 1491.076923076923
          },
          {
            "x": 3.230769230769231,
            "y": 1511.7692307692307
          },
          {
            "x": 3.3384615384615386,
            "y": 1532.4615384615386
          },
          {
            "x": 3.4461538461538463,
            "y": 1553.1538461538462
          },
          {
            "x": 3.5538461538461537,
            "y": 1573.8461538461538
          },
          {
            "x": 3.661538461538462,
            "y": 1594.5384615384614
          },
          {
            "x": 3.769230769230769,
            "y": 1615.2307692307693
          },
          {
            "x": 3.8769230769230774,
            "y": 1635.923076923077
          },
          {
            "x": 3.9846153846153847,
            "y": 1656.6153846153845
          },
          {
            "x": 4.092307692307692,
            "y": 1677.3076923076924
          },
          {
            "x": 4.2,
            "y": 1698.0
          },
          {
            "x": 4.2,
            "y": 1698.0
          },
          {
            "x": 4.318181818181818,
            "y": 1724.2727272727273
          },
          {
            "x": 4.4363636363636365,
            "y": 1750.5454545454545
          },
          {
            "x": 4.554545454545455,
            "y": 1776.8181818181818
          },
          {
            "x": 4.672727272727273,
            "y": 1803.090909090909
          },
          {
            "x": 4.790909090909091,
            "y": 1829.3636363636363
          },
          {
            "x": 4.909090909090909,
            "y": 1855.6363636363635
          },
          {
            "x": 5.027272727272727,
            "y": 1881.909090909091
          },
          {
            "x": 5.1454545454545455,
            "y": 1908.1818181818182
          },
          {
            "x": 5.263636363636364,
            "y": 1934.4545454545455
          },
          {
            "x": 5.381818181818182,
            "y": 1960.7272727272727
          },
          {
            "x": 5.5,
            "y": 1987.0
          },
          {
            "x": 5.5,
            "y": 1987.0
          },
          {
            "x": 5.607692307692307,
            "y": 2010.3076923076924
          },
          {
            "x": 5.7153846153846155,
            "y": 2033.6153846153845
          },
          {
            "x": 5.823076923076923,
            "y": 2056.923076923077
          },
          {
            "x": 5.930769230769231,
            "y": 2080.230769230769
          },
          {
            "x": 6.038461538461538,
            "y": 2103.5384615384614
          },
          {
            "x": 6.1461538461538465,
            "y": 2126.846153846154
          },
          {
            "x": 6.253846153846154,
            "y": 2150.153846153846
          },
          {
            "x": 6.361538461538462,
            "y": 2173.4615384615386
          },
          {
            "x": 6.469230769230769,
            "y": 2196.769230769231
          },
          {
            "x": 6.5769230769230775,
            "y": 2220.076923076923
          },
          {
            "x": 6.684615384615385,
            "y": 2243.3846153846152
          },
          {
            "x": 6.792307692307693,
            "y": 2266.6923076923076
          },
          {
            "x": 6.9,
            "y": 2290.0
          },
          {
            "x": 6.9,
            "y": 2290.0
          },
          {
            "x": 7.007692307692308,
            "y": 2314.230769230769
          },
          {
            "x": 7.115384615384616,
            "y": 2338.4615384615386
          },
          {
            "x": 7.223076923076923,
            "y": 2362.6923076923076
          },
          {
            "x": 7.330769230769231,
            "y": 2386.923076923077
          },
          {
            "x": 7.438461538461539,
            "y": 2411.153846153846
          },
          {
            "x": 7.546153846153847,
            "y": 2435.3846153846152
          },
          {
            "x": 7.653846153846154,
            "y": 2459.6153846153848
          },
          {
            "x": 7.761538461538462,
            "y": 2483.846153846154
          },
          {
            "x": 7.86923076923077,
            "y": 2508.076923076923
          },
          {
            "x": 7.976923076923078,
            "y": 2532.3076923076924
          },
          {
            "x": 8.084615384615386,
            "y": 2556.5384615384614
          },
          {
            "x": 8.192307692307693,
            "y": 2580.769230769231
          },
          {
            "x": 8.3,
            "y": 2605.0
          },
          {
            "x": 8.3,
            "y": 2605.0
          },
          {
            "x": 8.416666666666668,
            "y": 2632.25
          },
          {
            "x": 8.533333333333333,
            "y": 2659.5
          },
          {
            "x": 8.65,
            "y": 2686.75
          },
          {
            "x": 8.766666666666667,
            "y": 2714.0
          },
          {
            "x": 8.883333333333333,
            "y": 2741.25
          },
          {
            "x": 9.0,
            "y": 2768.5
          },
          {
            "x": 9.116666666666667,
            "y": 2795.75
          },
          {
            "x": 9.233333333333333,
            "y": 2823.0
          },
          {
            "x": 9.35,
            "y": 2850.25
          },
          {
            "x": 9.466666666666667,
            "y": 2877.5
          },
          {
            "x": 9.583333333333332,
            "y": 2904.75
          },
          {
            "x": 9.7,
            "y": 2932.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1187,
        "time": "07:50"
      },
      {
        "name": "登山道2合目",
        "distance": 2.8,
        "elevation": 1429,
        "time": "09:45"
      },
      {
        "name": "中間地点3",
        "distance": 4.2,
        "elevation": 1698,
        "time": "11:41"
      },
      {
        "name": "中間地点4",
        "distance": 5.5,
        "elevation": 1987,
        "time": "13:38"
      },
      {
        "name": "山頂付近5",
        "distance": 6.9,
        "elevation": 2290,
        "time": "15:36"
      },
      {
        "name": "山頂付近6",
        "distance": 8.3,
        "elevation": 2605,
        "time": "17:34"
      },
      {
        "name": "白馬岳山頂",
        "distance": 9.7,
        "elevation": 2932,
        "time": "19:34"
      }
    ],
    "stats": {
      "total_distance": 9.7,
      "elevation_gain": 1932,
      "base_elevation": 1000,
      "summit_elevation": 2932
    }
  },
  "五竜岳": {
    "mountain": "五竜岳",
    "datasets": [
      {
        "label": "五竜岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1014.5833333333334
          },
          {
            "x": 0.21666666666666667,
            "y": 1029.1666666666667
          },
          {
            "x": 0.325,
            "y": 1043.75
          },
          {
            "x": 0.43333333333333335,
            "y": 1058.3333333333333
          },
          {
            "x": 0.5416666666666667,
            "y": 1072.9166666666667
          },
          {
            "x": 0.65,
            "y": 1087.5
          },
          {
            "x": 0.7583333333333334,
            "y": 1102.0833333333333
          },
          {
            "x": 0.8666666666666667,
            "y": 1116.6666666666667
          },
          {
            "x": 0.9750000000000001,
            "y": 1131.25
          },
          {
            "x": 1.0833333333333335,
            "y": 1145.8333333333333
          },
          {
            "x": 1.1916666666666667,
            "y": 1160.4166666666667
          },
          {
            "x": 1.3,
            "y": 1175.0
          },
          {
            "x": 1.3,
            "y": 1175.0
          },
          {
            "x": 1.4083333333333334,
            "y": 1194.0
          },
          {
            "x": 1.5166666666666666,
            "y": 1213.0
          },
          {
            "x": 1.625,
            "y": 1232.0
          },
          {
            "x": 1.7333333333333334,
            "y": 1251.0
          },
          {
            "x": 1.8416666666666668,
            "y": 1270.0
          },
          {
            "x": 1.9500000000000002,
            "y": 1289.0
          },
          {
            "x": 2.0583333333333336,
            "y": 1308.0
          },
          {
            "x": 2.166666666666667,
            "y": 1327.0
          },
          {
            "x": 2.2750000000000004,
            "y": 1346.0
          },
          {
            "x": 2.3833333333333337,
            "y": 1365.0
          },
          {
            "x": 2.4916666666666667,
            "y": 1384.0
          },
          {
            "x": 2.6,
            "y": 1403.0
          },
          {
            "x": 2.6,
            "y": 1403.0
          },
          {
            "x": 2.7181818181818183,
            "y": 1426.0
          },
          {
            "x": 2.8363636363636364,
            "y": 1449.0
          },
          {
            "x": 2.9545454545454546,
            "y": 1472.0
          },
          {
            "x": 3.0727272727272728,
            "y": 1495.0
          },
          {
            "x": 3.190909090909091,
            "y": 1518.0
          },
          {
            "x": 3.309090909090909,
            "y": 1541.0
          },
          {
            "x": 3.4272727272727272,
            "y": 1564.0
          },
          {
            "x": 3.5454545454545454,
            "y": 1587.0
          },
          {
            "x": 3.6636363636363636,
            "y": 1610.0
          },
          {
            "x": 3.7818181818181817,
            "y": 1633.0
          },
          {
            "x": 3.9,
            "y": 1656.0
          },
          {
            "x": 3.9,
            "y": 1656.0
          },
          {
            "x": 4.008333333333333,
            "y": 1678.5
          },
          {
            "x": 4.116666666666666,
            "y": 1701.0
          },
          {
            "x": 4.225,
            "y": 1723.5
          },
          {
            "x": 4.333333333333333,
            "y": 1746.0
          },
          {
            "x": 4.441666666666666,
            "y": 1768.5
          },
          {
            "x": 4.55,
            "y": 1791.0
          },
          {
            "x": 4.658333333333333,
            "y": 1813.5
          },
          {
            "x": 4.766666666666667,
            "y": 1836.0
          },
          {
            "x": 4.875,
            "y": 1858.5
          },
          {
            "x": 4.983333333333333,
            "y": 1881.0
          },
          {
            "x": 5.091666666666667,
            "y": 1903.5
          },
          {
            "x": 5.2,
            "y": 1926.0
          },
          {
            "x": 5.2,
            "y": 1926.0
          },
          {
            "x": 5.318181818181818,
            "y": 1951.909090909091
          },
          {
            "x": 5.4363636363636365,
            "y": 1977.8181818181818
          },
          {
            "x": 5.554545454545455,
            "y": 2003.7272727272727
          },
          {
            "x": 5.672727272727273,
            "y": 2029.6363636363637
          },
          {
            "x": 5.790909090909091,
            "y": 2055.5454545454545
          },
          {
            "x": 5.909090909090909,
            "y": 2081.4545454545455
          },
          {
            "x": 6.027272727272727,
            "y": 2107.3636363636365
          },
          {
            "x": 6.1454545454545455,
            "y": 2133.2727272727275
          },
          {
            "x": 6.263636363636364,
            "y": 2159.181818181818
          },
          {
            "x": 6.381818181818182,
            "y": 2185.090909090909
          },
          {
            "x": 6.5,
            "y": 2211.0
          },
          {
            "x": 6.5,
            "y": 2211.0
          },
          {
            "x": 6.618181818181818,
            "y": 2237.909090909091
          },
          {
            "x": 6.736363636363636,
            "y": 2264.818181818182
          },
          {
            "x": 6.8545454545454545,
            "y": 2291.7272727272725
          },
          {
            "x": 6.972727272727273,
            "y": 2318.6363636363635
          },
          {
            "x": 7.090909090909091,
            "y": 2345.5454545454545
          },
          {
            "x": 7.209090909090909,
            "y": 2372.4545454545455
          },
          {
            "x": 7.327272727272727,
            "y": 2399.3636363636365
          },
          {
            "x": 7.445454545454545,
            "y": 2426.2727272727275
          },
          {
            "x": 7.5636363636363635,
            "y": 2453.181818181818
          },
          {
            "x": 7.681818181818182,
            "y": 2480.090909090909
          },
          {
            "x": 7.8,
            "y": 2507.0
          },
          {
            "x": 7.8,
            "y": 2507.0
          },
          {
            "x": 7.918181818181818,
            "y": 2534.909090909091
          },
          {
            "x": 8.036363636363635,
            "y": 2562.818181818182
          },
          {
            "x": 8.154545454545454,
            "y": 2590.7272727272725
          },
          {
            "x": 8.272727272727273,
            "y": 2618.6363636363635
          },
          {
            "x": 8.39090909090909,
            "y": 2646.5454545454545
          },
          {
            "x": 8.509090909090908,
            "y": 2674.4545454545455
          },
          {
            "x": 8.627272727272727,
            "y": 2702.3636363636365
          },
          {
            "x": 8.745454545454546,
            "y": 2730.2727272727275
          },
          {
            "x": 8.863636363636363,
            "y": 2758.181818181818
          },
          {
            "x": 8.98181818181818,
            "y": 2786.090909090909
          },
          {
            "x": 9.1,
            "y": 2814.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1175,
        "time": "07:44"
      },
      {
        "name": "登山道2合目",
        "distance": 2.6,
        "elevation": 1403,
        "time": "09:31"
      },
      {
        "name": "中間地点3",
        "distance": 3.9,
        "elevation": 1656,
        "time": "11:20"
      },
      {
        "name": "中間地点4",
        "distance": 5.2,
        "elevation": 1926,
        "time": "13:09"
      },
      {
        "name": "山頂付近5",
        "distance": 6.5,
        "elevation": 2211,
        "time": "15:00"
      },
      {
        "name": "山頂付近6",
        "distance": 7.8,
        "elevation": 2507,
        "time": "16:52"
      },
      {
        "name": "五竜岳山頂",
        "distance": 9.1,
        "elevation": 2814,
        "time": "18:44"
      }
    ],
    "stats": {
      "total_distance": 9.1,
      "elevation_gain": 1814,
      "base_elevation": 1000,
      "summit_elevation": 2814
    }
  },
  "鹿島槍ヶ岳": {
    "mountain": "鹿島槍ヶ岳",
    "datasets": [
      {
        "label": "鹿島槍ヶ岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1015.1666666666666
          },
          {
            "x": 0.21666666666666667,
            "y": 1030.3333333333333
          },
          {
            "x": 0.325,
            "y": 1045.5
          },
          {
            "x": 0.43333333333333335,
            "y": 1060.6666666666667
          },
          {
            "x": 0.5416666666666667,
            "y": 1075.8333333333333
          },
          {
            "x": 0.65,
            "y": 1091.0
          },
          {
            "x": 0.7583333333333334,
            "y": 1106.1666666666667
          },
          {
            "x": 0.8666666666666667,
            "y": 1121.3333333333333
          },
          {
            "x": 0.9750000000000001,
            "y": 1136.5
          },
          {
            "x": 1.0833333333333335,
            "y": 1151.6666666666667
          },
          {
            "x": 1.1916666666666667,
            "y": 1166.8333333333333
          },
          {
            "x": 1.3,
            "y": 1182.0
          },
          {
            "x": 1.3,
            "y": 1182.0
          },
          {
            "x": 1.4076923076923078,
            "y": 1200.3076923076924
          },
          {
            "x": 1.5153846153846156,
            "y": 1218.6153846153845
          },
          {
            "x": 1.623076923076923,
            "y": 1236.923076923077
          },
          {
            "x": 1.7307692307692308,
            "y": 1255.2307692307693
          },
          {
            "x": 1.8384615384615386,
            "y": 1273.5384615384614
          },
          {
            "x": 1.9461538461538463,
            "y": 1291.8461538461538
          },
          {
            "x": 2.0538461538461537,
            "y": 1310.1538461538462
          },
          {
            "x": 2.161538461538462,
            "y": 1328.4615384615386
          },
          {
            "x": 2.269230769230769,
            "y": 1346.7692307692307
          },
          {
            "x": 2.3769230769230774,
            "y": 1365.076923076923
          },
          {
            "x": 2.4846153846153847,
            "y": 1383.3846153846155
          },
          {
            "x": 2.592307692307693,
            "y": 1401.6923076923076
          },
          {
            "x": 2.7,
            "y": 1420.0
          },
          {
            "x": 2.7,
            "y": 1420.0
          },
          {
            "x": 2.8181818181818183,
            "y": 1443.909090909091
          },
          {
            "x": 2.9363636363636365,
            "y": 1467.8181818181818
          },
          {
            "x": 3.0545454545454547,
            "y": 1491.7272727272727
          },
          {
            "x": 3.172727272727273,
            "y": 1515.6363636363637
          },
          {
            "x": 3.290909090909091,
            "y": 1539.5454545454545
          },
          {
            "x": 3.409090909090909,
            "y": 1563.4545454545455
          },
          {
            "x": 3.5272727272727273,
            "y": 1587.3636363636365
          },
          {
            "x": 3.6454545454545455,
            "y": 1611.2727272727273
          },
          {
            "x": 3.7636363636363637,
            "y": 1635.1818181818182
          },
          {
            "x": 3.881818181818182,
            "y": 1659.090909090909
          },
          {
            "x": 4.0,
            "y": 1683.0
          },
          {
            "x": 4.0,
            "y": 1683.0
          },
          {
            "x": 4.107692307692307,
            "y": 1704.6923076923076
          },
          {
            "x": 4.2153846153846155,
            "y": 1726.3846153846155
          },
          {
            "x": 4.323076923076923,
            "y": 1748.076923076923
          },
          {
            "x": 4.430769230769231,
            "y": 1769.7692307692307
          },
          {
            "x": 4.538461538461538,
            "y": 1791.4615384615386
          },
          {
            "x": 4.6461538461538465,
            "y": 1813.1538461538462
          },
          {
            "x": 4.753846153846154,
            "y": 1834.8461538461538
          },
          {
            "x": 4.861538461538462,
            "y": 1856.5384615384614
          },
          {
            "x": 4.969230769230769,
            "y": 1878.2307692307693
          },
          {
            "x": 5.0769230769230775,
            "y": 1899.923076923077
          },
          {
            "x": 5.184615384615385,
            "y": 1921.6153846153845
          },
          {
            "x": 5.292307692307693,
            "y": 1943.3076923076924
          },
          {
            "x": 5.4,
            "y": 1965.0
          },
          {
            "x": 5.4,
            "y": 1965.0
          },
          {
            "x": 5.5181818181818185,
            "y": 1991.909090909091
          },
          {
            "x": 5.636363636363637,
            "y": 2018.8181818181818
          },
          {
            "x": 5.754545454545455,
            "y": 2045.7272727272727
          },
          {
            "x": 5.872727272727273,
            "y": 2072.6363636363635
          },
          {
            "x": 5.990909090909091,
            "y": 2099.5454545454545
          },
          {
            "x": 6.109090909090909,
            "y": 2126.4545454545455
          },
          {
            "x": 6.2272727272727275,
            "y": 2153.3636363636365
          },
          {
            "x": 6.345454545454546,
            "y": 2180.2727272727275
          },
          {
            "x": 6.463636363636364,
            "y": 2207.181818181818
          },
          {
            "x": 6.581818181818182,
            "y": 2234.090909090909
          },
          {
            "x": 6.7,
            "y": 2261.0
          },
          {
            "x": 6.7,
            "y": 2261.0
          },
          {
            "x": 6.816666666666666,
            "y": 2286.6666666666665
          },
          {
            "x": 6.933333333333334,
            "y": 2312.3333333333335
          },
          {
            "x": 7.05,
            "y": 2338.0
          },
          {
            "x": 7.166666666666667,
            "y": 2363.6666666666665
          },
          {
            "x": 7.283333333333333,
            "y": 2389.3333333333335
          },
          {
            "x": 7.4,
            "y": 2415.0
          },
          {
            "x": 7.516666666666667,
            "y": 2440.6666666666665
          },
          {
            "x": 7.633333333333333,
            "y": 2466.3333333333335
          },
          {
            "x": 7.75,
            "y": 2492.0
          },
          {
            "x": 7.866666666666666,
            "y": 2517.6666666666665
          },
          {
            "x": 7.9833333333333325,
            "y": 2543.3333333333335
          },
          {
            "x": 8.1,
            "y": 2569.0
          },
          {
            "x": 8.1,
            "y": 2569.0
          },
          {
            "x": 8.208333333333332,
            "y": 2595.6666666666665
          },
          {
            "x": 8.316666666666666,
            "y": 2622.3333333333335
          },
          {
            "x": 8.425,
            "y": 2649.0
          },
          {
            "x": 8.533333333333333,
            "y": 2675.6666666666665
          },
          {
            "x": 8.641666666666666,
            "y": 2702.3333333333335
          },
          {
            "x": 8.75,
            "y": 2729.0
          },
          {
            "x": 8.858333333333334,
            "y": 2755.6666666666665
          },
          {
            "x": 8.966666666666667,
            "y": 2782.3333333333335
          },
          {
            "x": 9.075,
            "y": 2809.0
          },
          {
            "x": 9.183333333333334,
            "y": 2835.6666666666665
          },
          {
            "x": 9.291666666666668,
            "y": 2862.3333333333335
          },
          {
            "x": 9.4,
            "y": 2889.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1182,
        "time": "07:47"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1420,
        "time": "09:38"
      },
      {
        "name": "中間地点3",
        "distance": 4.0,
        "elevation": 1683,
        "time": "11:31"
      },
      {
        "name": "中間地点4",
        "distance": 5.4,
        "elevation": 1965,
        "time": "13:24"
      },
      {
        "name": "山頂付近5",
        "distance": 6.7,
        "elevation": 2261,
        "time": "15:19"
      },
      {
        "name": "山頂付近6",
        "distance": 8.1,
        "elevation": 2569,
        "time": "17:14"
      },
      {
        "name": "鹿島槍ヶ岳山頂",
        "distance": 9.4,
        "elevation": 2889,
        "time": "19:10"
      }
    ],
    "stats": {
      "total_distance": 9.4,
      "elevation_gain": 1889,
      "base_elevation": 1000,
      "summit_elevation": 2889
    }
  },
  "木曽駒ヶ岳": {
    "mountain": "木曽駒ヶ岳",
    "datasets": [
      {
        "label": "木曽駒ヶ岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.5384615384615
          },
          {
            "x": 0.2153846153846154,
            "y": 1029.076923076923
          },
          {
            "x": 0.3230769230769231,
            "y": 1043.6153846153845
          },
          {
            "x": 0.4307692307692308,
            "y": 1058.1538461538462
          },
          {
            "x": 0.5384615384615384,
            "y": 1072.6923076923076
          },
          {
            "x": 0.6461538461538462,
            "y": 1087.2307692307693
          },
          {
            "x": 0.7538461538461537,
            "y": 1101.7692307692307
          },
          {
            "x": 0.8615384615384616,
            "y": 1116.3076923076924
          },
          {
            "x": 0.9692307692307691,
            "y": 1130.8461538461538
          },
          {
            "x": 1.0769230769230769,
            "y": 1145.3846153846155
          },
          {
            "x": 1.1846153846153846,
            "y": 1159.923076923077
          },
          {
            "x": 1.2923076923076924,
            "y": 1174.4615384615386
          },
          {
            "x": 1.4,
            "y": 1189.0
          },
          {
            "x": 1.4,
            "y": 1189.0
          },
          {
            "x": 1.5076923076923077,
            "y": 1207.8461538461538
          },
          {
            "x": 1.6153846153846154,
            "y": 1226.6923076923076
          },
          {
            "x": 1.723076923076923,
            "y": 1245.5384615384614
          },
          {
            "x": 1.8307692307692307,
            "y": 1264.3846153846155
          },
          {
            "x": 1.9384615384615382,
            "y": 1283.2307692307693
          },
          {
            "x": 2.046153846153846,
            "y": 1302.076923076923
          },
          {
            "x": 2.1538461538461537,
            "y": 1320.923076923077
          },
          {
            "x": 2.2615384615384615,
            "y": 1339.7692307692307
          },
          {
            "x": 2.369230769230769,
            "y": 1358.6153846153845
          },
          {
            "x": 2.476923076923077,
            "y": 1377.4615384615386
          },
          {
            "x": 2.5846153846153843,
            "y": 1396.3076923076924
          },
          {
            "x": 2.6923076923076925,
            "y": 1415.1538461538462
          },
          {
            "x": 2.8,
            "y": 1434.0
          },
          {
            "x": 2.8,
            "y": 1434.0
          },
          {
            "x": 2.9076923076923076,
            "y": 1455.0
          },
          {
            "x": 3.0153846153846153,
            "y": 1476.0
          },
          {
            "x": 3.123076923076923,
            "y": 1497.0
          },
          {
            "x": 3.230769230769231,
            "y": 1518.0
          },
          {
            "x": 3.3384615384615386,
            "y": 1539.0
          },
          {
            "x": 3.4461538461538463,
            "y": 1560.0
          },
          {
            "x": 3.5538461538461537,
            "y": 1581.0
          },
          {
            "x": 3.661538461538462,
            "y": 1602.0
          },
          {
            "x": 3.769230769230769,
            "y": 1623.0
          },
          {
            "x": 3.8769230769230774,
            "y": 1644.0
          },
          {
            "x": 3.9846153846153847,
            "y": 1665.0
          },
          {
            "x": 4.092307692307692,
            "y": 1686.0
          },
          {
            "x": 4.2,
            "y": 1707.0
          },
          {
            "x": 4.2,
            "y": 1707.0
          },
          {
            "x": 4.316666666666666,
            "y": 1731.3333333333333
          },
          {
            "x": 4.433333333333334,
            "y": 1755.6666666666667
          },
          {
            "x": 4.55,
            "y": 1780.0
          },
          {
            "x": 4.666666666666667,
            "y": 1804.3333333333333
          },
          {
            "x": 4.783333333333333,
            "y": 1828.6666666666667
          },
          {
            "x": 4.9,
            "y": 1853.0
          },
          {
            "x": 5.016666666666667,
            "y": 1877.3333333333333
          },
          {
            "x": 5.133333333333333,
            "y": 1901.6666666666667
          },
          {
            "x": 5.25,
            "y": 1926.0
          },
          {
            "x": 5.366666666666666,
            "y": 1950.3333333333333
          },
          {
            "x": 5.4833333333333325,
            "y": 1974.6666666666665
          },
          {
            "x": 5.6,
            "y": 1999.0
          },
          {
            "x": 5.6,
            "y": 1999.0
          },
          {
            "x": 5.707692307692307,
            "y": 2022.6153846153845
          },
          {
            "x": 5.815384615384615,
            "y": 2046.2307692307693
          },
          {
            "x": 5.9230769230769225,
            "y": 2069.846153846154
          },
          {
            "x": 6.030769230769231,
            "y": 2093.4615384615386
          },
          {
            "x": 6.138461538461538,
            "y": 2117.076923076923
          },
          {
            "x": 6.246153846153846,
            "y": 2140.6923076923076
          },
          {
            "x": 6.3538461538461535,
            "y": 2164.3076923076924
          },
          {
            "x": 6.461538461538462,
            "y": 2187.923076923077
          },
          {
            "x": 6.569230769230769,
            "y": 2211.5384615384614
          },
          {
            "x": 6.676923076923077,
            "y": 2235.153846153846
          },
          {
            "x": 6.7846153846153845,
            "y": 2258.769230769231
          },
          {
            "x": 6.892307692307693,
            "y": 2282.3846153846152
          },
          {
            "x": 7.0,
            "y": 2306.0
          },
          {
            "x": 7.0,
            "y": 2306.0
          },
          {
            "x": 7.107692307692307,
            "y": 2330.5384615384614
          },
          {
            "x": 7.2153846153846155,
            "y": 2355.076923076923
          },
          {
            "x": 7.323076923076923,
            "y": 2379.6153846153848
          },
          {
            "x": 7.430769230769231,
            "y": 2404.153846153846
          },
          {
            "x": 7.538461538461538,
            "y": 2428.6923076923076
          },
          {
            "x": 7.6461538461538465,
            "y": 2453.230769230769
          },
          {
            "x": 7.753846153846154,
            "y": 2477.769230769231
          },
          {
            "x": 7.861538461538462,
            "y": 2502.3076923076924
          },
          {
            "x": 7.969230769230769,
            "y": 2526.846153846154
          },
          {
            "x": 8.076923076923077,
            "y": 2551.3846153846152
          },
          {
            "x": 8.184615384615384,
            "y": 2575.923076923077
          },
          {
            "x": 8.292307692307693,
            "y": 2600.4615384615386
          },
          {
            "x": 8.4,
            "y": 2625.0
          },
          {
            "x": 8.4,
            "y": 2625.0
          },
          {
            "x": 8.507692307692308,
            "y": 2650.4615384615386
          },
          {
            "x": 8.615384615384615,
            "y": 2675.923076923077
          },
          {
            "x": 8.723076923076924,
            "y": 2701.3846153846152
          },
          {
            "x": 8.830769230769231,
            "y": 2726.846153846154
          },
          {
            "x": 8.938461538461539,
            "y": 2752.3076923076924
          },
          {
            "x": 9.046153846153846,
            "y": 2777.769230769231
          },
          {
            "x": 9.153846153846155,
            "y": 2803.230769230769
          },
          {
            "x": 9.261538461538462,
            "y": 2828.6923076923076
          },
          {
            "x": 9.36923076923077,
            "y": 2854.153846153846
          },
          {
            "x": 9.476923076923077,
            "y": 2879.6153846153848
          },
          {
            "x": 9.584615384615386,
            "y": 2905.076923076923
          },
          {
            "x": 9.692307692307693,
            "y": 2930.5384615384614
          },
          {
            "x": 9.8,
            "y": 2956.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1189,
        "time": "07:52"
      },
      {
        "name": "登山道2合目",
        "distance": 2.8,
        "elevation": 1434,
        "time": "09:47"
      },
      {
        "name": "中間地点3",
        "distance": 4.2,
        "elevation": 1707,
        "time": "11:44"
      },
      {
        "name": "中間地点4",
        "distance": 5.6,
        "elevation": 1999,
        "time": "13:43"
      },
      {
        "name": "山頂付近5",
        "distance": 7.0,
        "elevation": 2306,
        "time": "15:42"
      },
      {
        "name": "山頂付近6",
        "distance": 8.4,
        "elevation": 2625,
        "time": "17:42"
      },
      {
        "name": "木曽駒ヶ岳山頂",
        "distance": 9.8,
        "elevation": 2956,
        "time": "19:42"
      }
    ],
    "stats": {
      "total_distance": 9.8,
      "elevation_gain": 1956,
      "base_elevation": 1000,
      "summit_elevation": 2956
    }
  },
  "空木岳": {
    "mountain": "空木岳",
    "datasets": [
      {
        "label": "空木岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1015.0
          },
          {
            "x": 0.21666666666666667,
            "y": 1030.0
          },
          {
            "x": 0.325,
            "y": 1045.0
          },
          {
            "x": 0.43333333333333335,
            "y": 1060.0
          },
          {
            "x": 0.5416666666666667,
            "y": 1075.0
          },
          {
            "x": 0.65,
            "y": 1090.0
          },
          {
            "x": 0.7583333333333334,
            "y": 1105.0
          },
          {
            "x": 0.8666666666666667,
            "y": 1120.0
          },
          {
            "x": 0.9750000000000001,
            "y": 1135.0
          },
          {
            "x": 1.0833333333333335,
            "y": 1150.0
          },
          {
            "x": 1.1916666666666667,
            "y": 1165.0
          },
          {
            "x": 1.3,
            "y": 1180.0
          },
          {
            "x": 1.3,
            "y": 1180.0
          },
          {
            "x": 1.4076923076923078,
            "y": 1198.0
          },
          {
            "x": 1.5153846153846156,
            "y": 1216.0
          },
          {
            "x": 1.623076923076923,
            "y": 1234.0
          },
          {
            "x": 1.7307692307692308,
            "y": 1252.0
          },
          {
            "x": 1.8384615384615386,
            "y": 1270.0
          },
          {
            "x": 1.9461538461538463,
            "y": 1288.0
          },
          {
            "x": 2.0538461538461537,
            "y": 1306.0
          },
          {
            "x": 2.161538461538462,
            "y": 1324.0
          },
          {
            "x": 2.269230769230769,
            "y": 1342.0
          },
          {
            "x": 2.3769230769230774,
            "y": 1360.0
          },
          {
            "x": 2.4846153846153847,
            "y": 1378.0
          },
          {
            "x": 2.592307692307693,
            "y": 1396.0
          },
          {
            "x": 2.7,
            "y": 1414.0
          },
          {
            "x": 2.7,
            "y": 1414.0
          },
          {
            "x": 2.8181818181818183,
            "y": 1437.6363636363637
          },
          {
            "x": 2.9363636363636365,
            "y": 1461.2727272727273
          },
          {
            "x": 3.0545454545454547,
            "y": 1484.909090909091
          },
          {
            "x": 3.172727272727273,
            "y": 1508.5454545454545
          },
          {
            "x": 3.290909090909091,
            "y": 1532.1818181818182
          },
          {
            "x": 3.409090909090909,
            "y": 1555.8181818181818
          },
          {
            "x": 3.5272727272727273,
            "y": 1579.4545454545455
          },
          {
            "x": 3.6454545454545455,
            "y": 1603.090909090909
          },
          {
            "x": 3.7636363636363637,
            "y": 1626.7272727272727
          },
          {
            "x": 3.881818181818182,
            "y": 1650.3636363636363
          },
          {
            "x": 4.0,
            "y": 1674.0
          },
          {
            "x": 4.0,
            "y": 1674.0
          },
          {
            "x": 4.118181818181818,
            "y": 1699.2727272727273
          },
          {
            "x": 4.236363636363636,
            "y": 1724.5454545454545
          },
          {
            "x": 4.3545454545454545,
            "y": 1749.8181818181818
          },
          {
            "x": 4.472727272727273,
            "y": 1775.090909090909
          },
          {
            "x": 4.590909090909091,
            "y": 1800.3636363636363
          },
          {
            "x": 4.709090909090909,
            "y": 1825.6363636363635
          },
          {
            "x": 4.827272727272727,
            "y": 1850.909090909091
          },
          {
            "x": 4.945454545454545,
            "y": 1876.1818181818182
          },
          {
            "x": 5.0636363636363635,
            "y": 1901.4545454545455
          },
          {
            "x": 5.181818181818182,
            "y": 1926.7272727272727
          },
          {
            "x": 5.3,
            "y": 1952.0
          },
          {
            "x": 5.3,
            "y": 1952.0
          },
          {
            "x": 5.418181818181818,
            "y": 1978.5454545454545
          },
          {
            "x": 5.536363636363636,
            "y": 2005.090909090909
          },
          {
            "x": 5.654545454545454,
            "y": 2031.6363636363635
          },
          {
            "x": 5.7727272727272725,
            "y": 2058.181818181818
          },
          {
            "x": 5.890909090909091,
            "y": 2084.7272727272725
          },
          {
            "x": 6.009090909090909,
            "y": 2111.272727272727
          },
          {
            "x": 6.127272727272727,
            "y": 2137.818181818182
          },
          {
            "x": 6.245454545454545,
            "y": 2164.3636363636365
          },
          {
            "x": 6.363636363636363,
            "y": 2190.909090909091
          },
          {
            "x": 6.4818181818181815,
            "y": 2217.4545454545455
          },
          {
            "x": 6.6,
            "y": 2244.0
          },
          {
            "x": 6.6,
            "y": 2244.0
          },
          {
            "x": 6.707692307692307,
            "y": 2267.4615384615386
          },
          {
            "x": 6.815384615384615,
            "y": 2290.923076923077
          },
          {
            "x": 6.9230769230769225,
            "y": 2314.3846153846152
          },
          {
            "x": 7.030769230769231,
            "y": 2337.846153846154
          },
          {
            "x": 7.138461538461538,
            "y": 2361.3076923076924
          },
          {
            "x": 7.246153846153846,
            "y": 2384.769230769231
          },
          {
            "x": 7.3538461538461535,
            "y": 2408.230769230769
          },
          {
            "x": 7.461538461538462,
            "y": 2431.6923076923076
          },
          {
            "x": 7.569230769230769,
            "y": 2455.153846153846
          },
          {
            "x": 7.676923076923077,
            "y": 2478.6153846153848
          },
          {
            "x": 7.7846153846153845,
            "y": 2502.076923076923
          },
          {
            "x": 7.892307692307693,
            "y": 2525.5384615384614
          },
          {
            "x": 8.0,
            "y": 2549.0
          },
          {
            "x": 8.0,
            "y": 2549.0
          },
          {
            "x": 8.108333333333334,
            "y": 2575.25
          },
          {
            "x": 8.216666666666667,
            "y": 2601.5
          },
          {
            "x": 8.325,
            "y": 2627.75
          },
          {
            "x": 8.433333333333334,
            "y": 2654.0
          },
          {
            "x": 8.541666666666668,
            "y": 2680.25
          },
          {
            "x": 8.65,
            "y": 2706.5
          },
          {
            "x": 8.758333333333333,
            "y": 2732.75
          },
          {
            "x": 8.866666666666667,
            "y": 2759.0
          },
          {
            "x": 8.975000000000001,
            "y": 2785.25
          },
          {
            "x": 9.083333333333334,
            "y": 2811.5
          },
          {
            "x": 9.191666666666666,
            "y": 2837.75
          },
          {
            "x": 9.3,
            "y": 2864.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1180,
        "time": "07:46"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1414,
        "time": "09:36"
      },
      {
        "name": "中間地点3",
        "distance": 4.0,
        "elevation": 1674,
        "time": "11:27"
      },
      {
        "name": "中間地点4",
        "distance": 5.3,
        "elevation": 1952,
        "time": "13:19"
      },
      {
        "name": "山頂付近5",
        "distance": 6.6,
        "elevation": 2244,
        "time": "15:12"
      },
      {
        "name": "山頂付近6",
        "distance": 8.0,
        "elevation": 2549,
        "time": "17:06"
      },
      {
        "name": "空木岳山頂",
        "distance": 9.3,
        "elevation": 2864,
        "time": "19:01"
      }
    ],
    "stats": {
      "total_distance": 9.3,
      "elevation_gain": 1864,
      "base_elevation": 1000,
      "summit_elevation": 2864
    }
  },
  "恵那山": {
    "mountain": "恵那山",
    "datasets": [
      {
        "label": "恵那山 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.09999999999999999,
            "y": 1012.7777777777778
          },
          {
            "x": 0.19999999999999998,
            "y": 1025.5555555555557
          },
          {
            "x": 0.3,
            "y": 1038.3333333333333
          },
          {
            "x": 0.39999999999999997,
            "y": 1051.111111111111
          },
          {
            "x": 0.5,
            "y": 1063.888888888889
          },
          {
            "x": 0.6,
            "y": 1076.6666666666667
          },
          {
            "x": 0.7000000000000001,
            "y": 1089.4444444444443
          },
          {
            "x": 0.7999999999999999,
            "y": 1102.2222222222222
          },
          {
            "x": 0.9,
            "y": 1115.0
          },
          {
            "x": 0.9,
            "y": 1115.0
          },
          {
            "x": 0.9888888888888889,
            "y": 1131.5555555555557
          },
          {
            "x": 1.0777777777777777,
            "y": 1148.111111111111
          },
          {
            "x": 1.1666666666666665,
            "y": 1164.6666666666667
          },
          {
            "x": 1.2555555555555555,
            "y": 1181.2222222222222
          },
          {
            "x": 1.3444444444444446,
            "y": 1197.7777777777778
          },
          {
            "x": 1.4333333333333331,
            "y": 1214.3333333333333
          },
          {
            "x": 1.5222222222222221,
            "y": 1230.888888888889
          },
          {
            "x": 1.6111111111111112,
            "y": 1247.4444444444443
          },
          {
            "x": 1.7,
            "y": 1264.0
          },
          {
            "x": 1.7,
            "y": 1264.0
          },
          {
            "x": 1.8,
            "y": 1282.4444444444443
          },
          {
            "x": 1.9,
            "y": 1300.888888888889
          },
          {
            "x": 2.0,
            "y": 1319.3333333333333
          },
          {
            "x": 2.1,
            "y": 1337.7777777777778
          },
          {
            "x": 2.2,
            "y": 1356.2222222222222
          },
          {
            "x": 2.3,
            "y": 1374.6666666666667
          },
          {
            "x": 2.4,
            "y": 1393.111111111111
          },
          {
            "x": 2.5,
            "y": 1411.5555555555557
          },
          {
            "x": 2.6,
            "y": 1430.0
          },
          {
            "x": 2.6,
            "y": 1430.0
          },
          {
            "x": 2.688888888888889,
            "y": 1449.7777777777778
          },
          {
            "x": 2.7777777777777777,
            "y": 1469.5555555555557
          },
          {
            "x": 2.8666666666666667,
            "y": 1489.3333333333333
          },
          {
            "x": 2.9555555555555557,
            "y": 1509.111111111111
          },
          {
            "x": 3.0444444444444443,
            "y": 1528.888888888889
          },
          {
            "x": 3.1333333333333333,
            "y": 1548.6666666666667
          },
          {
            "x": 3.2222222222222223,
            "y": 1568.4444444444443
          },
          {
            "x": 3.311111111111111,
            "y": 1588.2222222222222
          },
          {
            "x": 3.4,
            "y": 1608.0
          },
          {
            "x": 3.4,
            "y": 1608.0
          },
          {
            "x": 3.5,
            "y": 1628.7777777777778
          },
          {
            "x": 3.5999999999999996,
            "y": 1649.5555555555557
          },
          {
            "x": 3.6999999999999997,
            "y": 1670.3333333333333
          },
          {
            "x": 3.8,
            "y": 1691.111111111111
          },
          {
            "x": 3.9,
            "y": 1711.888888888889
          },
          {
            "x": 4.0,
            "y": 1732.6666666666667
          },
          {
            "x": 4.1,
            "y": 1753.4444444444443
          },
          {
            "x": 4.199999999999999,
            "y": 1774.2222222222222
          },
          {
            "x": 4.3,
            "y": 1795.0
          },
          {
            "x": 4.3,
            "y": 1795.0
          },
          {
            "x": 4.388888888888888,
            "y": 1816.5555555555557
          },
          {
            "x": 4.477777777777778,
            "y": 1838.111111111111
          },
          {
            "x": 4.566666666666666,
            "y": 1859.6666666666667
          },
          {
            "x": 4.655555555555555,
            "y": 1881.2222222222222
          },
          {
            "x": 4.7444444444444445,
            "y": 1902.7777777777778
          },
          {
            "x": 4.833333333333333,
            "y": 1924.3333333333333
          },
          {
            "x": 4.922222222222222,
            "y": 1945.888888888889
          },
          {
            "x": 5.011111111111111,
            "y": 1967.4444444444443
          },
          {
            "x": 5.1,
            "y": 1989.0
          },
          {
            "x": 5.1,
            "y": 1989.0
          },
          {
            "x": 5.199999999999999,
            "y": 2011.4444444444443
          },
          {
            "x": 5.3,
            "y": 2033.888888888889
          },
          {
            "x": 5.3999999999999995,
            "y": 2056.3333333333335
          },
          {
            "x": 5.5,
            "y": 2078.777777777778
          },
          {
            "x": 5.6,
            "y": 2101.222222222222
          },
          {
            "x": 5.7,
            "y": 2123.6666666666665
          },
          {
            "x": 5.8,
            "y": 2146.1111111111113
          },
          {
            "x": 5.9,
            "y": 2168.5555555555557
          },
          {
            "x": 6.0,
            "y": 2191.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 0.9,
        "elevation": 1115,
        "time": "07:08"
      },
      {
        "name": "登山道2合目",
        "distance": 1.7,
        "elevation": 1264,
        "time": "08:19"
      },
      {
        "name": "中間地点3",
        "distance": 2.6,
        "elevation": 1430,
        "time": "09:30"
      },
      {
        "name": "中間地点4",
        "distance": 3.4,
        "elevation": 1608,
        "time": "10:43"
      },
      {
        "name": "山頂付近5",
        "distance": 4.3,
        "elevation": 1795,
        "time": "11:56"
      },
      {
        "name": "山頂付近6",
        "distance": 5.1,
        "elevation": 1989,
        "time": "13:09"
      },
      {
        "name": "恵那山山頂",
        "distance": 6.0,
        "elevation": 2191,
        "time": "14:23"
      }
    ],
    "stats": {
      "total_distance": 6.0,
      "elevation_gain": 1191,
      "base_elevation": 1000,
      "summit_elevation": 2191
    }
  },
  "甲斐駒ヶ岳": {
    "mountain": "甲斐駒ヶ岳",
    "datasets": [
      {
        "label": "甲斐駒ヶ岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.6153846153846
          },
          {
            "x": 0.2153846153846154,
            "y": 1029.2307692307693
          },
          {
            "x": 0.3230769230769231,
            "y": 1043.8461538461538
          },
          {
            "x": 0.4307692307692308,
            "y": 1058.4615384615386
          },
          {
            "x": 0.5384615384615384,
            "y": 1073.076923076923
          },
          {
            "x": 0.6461538461538462,
            "y": 1087.6923076923076
          },
          {
            "x": 0.7538461538461537,
            "y": 1102.3076923076924
          },
          {
            "x": 0.8615384615384616,
            "y": 1116.923076923077
          },
          {
            "x": 0.9692307692307691,
            "y": 1131.5384615384614
          },
          {
            "x": 1.0769230769230769,
            "y": 1146.1538461538462
          },
          {
            "x": 1.1846153846153846,
            "y": 1160.7692307692307
          },
          {
            "x": 1.2923076923076924,
            "y": 1175.3846153846155
          },
          {
            "x": 1.4,
            "y": 1190.0
          },
          {
            "x": 1.4,
            "y": 1190.0
          },
          {
            "x": 1.5076923076923077,
            "y": 1209.0
          },
          {
            "x": 1.6153846153846154,
            "y": 1228.0
          },
          {
            "x": 1.723076923076923,
            "y": 1247.0
          },
          {
            "x": 1.8307692307692307,
            "y": 1266.0
          },
          {
            "x": 1.9384615384615382,
            "y": 1285.0
          },
          {
            "x": 2.046153846153846,
            "y": 1304.0
          },
          {
            "x": 2.1538461538461537,
            "y": 1323.0
          },
          {
            "x": 2.2615384615384615,
            "y": 1342.0
          },
          {
            "x": 2.369230769230769,
            "y": 1361.0
          },
          {
            "x": 2.476923076923077,
            "y": 1380.0
          },
          {
            "x": 2.5846153846153843,
            "y": 1399.0
          },
          {
            "x": 2.6923076923076925,
            "y": 1418.0
          },
          {
            "x": 2.8,
            "y": 1437.0
          },
          {
            "x": 2.8,
            "y": 1437.0
          },
          {
            "x": 2.9076923076923076,
            "y": 1458.076923076923
          },
          {
            "x": 3.0153846153846153,
            "y": 1479.1538461538462
          },
          {
            "x": 3.123076923076923,
            "y": 1500.2307692307693
          },
          {
            "x": 3.230769230769231,
            "y": 1521.3076923076924
          },
          {
            "x": 3.3384615384615386,
            "y": 1542.3846153846155
          },
          {
            "x": 3.4461538461538463,
            "y": 1563.4615384615386
          },
          {
            "x": 3.5538461538461537,
            "y": 1584.5384615384614
          },
          {
            "x": 3.661538461538462,
            "y": 1605.6153846153845
          },
          {
            "x": 3.769230769230769,
            "y": 1626.6923076923076
          },
          {
            "x": 3.8769230769230774,
            "y": 1647.7692307692307
          },
          {
            "x": 3.9846153846153847,
            "y": 1668.8461538461538
          },
          {
            "x": 4.092307692307692,
            "y": 1689.923076923077
          },
          {
            "x": 4.2,
            "y": 1711.0
          },
          {
            "x": 4.2,
            "y": 1711.0
          },
          {
            "x": 4.316666666666666,
            "y": 1735.4166666666667
          },
          {
            "x": 4.433333333333334,
            "y": 1759.8333333333333
          },
          {
            "x": 4.55,
            "y": 1784.25
          },
          {
            "x": 4.666666666666667,
            "y": 1808.6666666666667
          },
          {
            "x": 4.783333333333333,
            "y": 1833.0833333333333
          },
          {
            "x": 4.9,
            "y": 1857.5
          },
          {
            "x": 5.016666666666667,
            "y": 1881.9166666666667
          },
          {
            "x": 5.133333333333333,
            "y": 1906.3333333333333
          },
          {
            "x": 5.25,
            "y": 1930.75
          },
          {
            "x": 5.366666666666666,
            "y": 1955.1666666666667
          },
          {
            "x": 5.4833333333333325,
            "y": 1979.5833333333333
          },
          {
            "x": 5.6,
            "y": 2004.0
          },
          {
            "x": 5.6,
            "y": 2004.0
          },
          {
            "x": 5.707692307692307,
            "y": 2027.7692307692307
          },
          {
            "x": 5.815384615384615,
            "y": 2051.5384615384614
          },
          {
            "x": 5.9230769230769225,
            "y": 2075.3076923076924
          },
          {
            "x": 6.030769230769231,
            "y": 2099.076923076923
          },
          {
            "x": 6.138461538461538,
            "y": 2122.846153846154
          },
          {
            "x": 6.246153846153846,
            "y": 2146.6153846153848
          },
          {
            "x": 6.3538461538461535,
            "y": 2170.3846153846152
          },
          {
            "x": 6.461538461538462,
            "y": 2194.153846153846
          },
          {
            "x": 6.569230769230769,
            "y": 2217.923076923077
          },
          {
            "x": 6.676923076923077,
            "y": 2241.6923076923076
          },
          {
            "x": 6.7846153846153845,
            "y": 2265.4615384615386
          },
          {
            "x": 6.892307692307693,
            "y": 2289.230769230769
          },
          {
            "x": 7.0,
            "y": 2313.0
          },
          {
            "x": 7.0,
            "y": 2313.0
          },
          {
            "x": 7.107692307692307,
            "y": 2337.6923076923076
          },
          {
            "x": 7.2153846153846155,
            "y": 2362.3846153846152
          },
          {
            "x": 7.323076923076923,
            "y": 2387.076923076923
          },
          {
            "x": 7.430769230769231,
            "y": 2411.769230769231
          },
          {
            "x": 7.538461538461538,
            "y": 2436.4615384615386
          },
          {
            "x": 7.6461538461538465,
            "y": 2461.153846153846
          },
          {
            "x": 7.753846153846154,
            "y": 2485.846153846154
          },
          {
            "x": 7.861538461538462,
            "y": 2510.5384615384614
          },
          {
            "x": 7.969230769230769,
            "y": 2535.230769230769
          },
          {
            "x": 8.076923076923077,
            "y": 2559.923076923077
          },
          {
            "x": 8.184615384615384,
            "y": 2584.6153846153848
          },
          {
            "x": 8.292307692307693,
            "y": 2609.3076923076924
          },
          {
            "x": 8.4,
            "y": 2634.0
          },
          {
            "x": 8.4,
            "y": 2634.0
          },
          {
            "x": 8.507692307692308,
            "y": 2659.6153846153848
          },
          {
            "x": 8.615384615384615,
            "y": 2685.230769230769
          },
          {
            "x": 8.723076923076924,
            "y": 2710.846153846154
          },
          {
            "x": 8.830769230769231,
            "y": 2736.4615384615386
          },
          {
            "x": 8.938461538461539,
            "y": 2762.076923076923
          },
          {
            "x": 9.046153846153846,
            "y": 2787.6923076923076
          },
          {
            "x": 9.153846153846155,
            "y": 2813.3076923076924
          },
          {
            "x": 9.261538461538462,
            "y": 2838.923076923077
          },
          {
            "x": 9.36923076923077,
            "y": 2864.5384615384614
          },
          {
            "x": 9.476923076923077,
            "y": 2890.153846153846
          },
          {
            "x": 9.584615384615386,
            "y": 2915.769230769231
          },
          {
            "x": 9.692307692307693,
            "y": 2941.3846153846152
          },
          {
            "x": 9.8,
            "y": 2967.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1190,
        "time": "07:52"
      },
      {
        "name": "登山道2合目",
        "distance": 2.8,
        "elevation": 1437,
        "time": "09:47"
      },
      {
        "name": "中間地点3",
        "distance": 4.2,
        "elevation": 1711,
        "time": "11:45"
      },
      {
        "name": "中間地点4",
        "distance": 5.6,
        "elevation": 2004,
        "time": "13:43"
      },
      {
        "name": "山頂付近5",
        "distance": 7.0,
        "elevation": 2313,
        "time": "15:42"
      },
      {
        "name": "山頂付近6",
        "distance": 8.4,
        "elevation": 2634,
        "time": "17:42"
      },
      {
        "name": "甲斐駒ヶ岳山頂",
        "distance": 9.8,
        "elevation": 2967,
        "time": "19:43"
      }
    ],
    "stats": {
      "total_distance": 9.8,
      "elevation_gain": 1967,
      "base_elevation": 1000,
      "summit_elevation": 2967
    }
  },
  "仙丈ヶ岳": {
    "mountain": "仙丈ヶ岳",
    "datasets": [
      {
        "label": "仙丈ヶ岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1033.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1047.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1062.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1077.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1092.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1107.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1122.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1136.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1151.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1166.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1181.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1196.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1211.1538461538462
          },
          {
            "x": 1.4,
            "y": 1226.0
          },
          {
            "x": 1.4,
            "y": 1226.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1243.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1261.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1279.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1297.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1315.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1333.5714285714287
          },
          {
            "x": 2.15,
            "y": 1351.5
          },
          {
            "x": 2.257142857142857,
            "y": 1369.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1387.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1405.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1423.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1441.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1459.0714285714287
          },
          {
            "x": 2.9,
            "y": 1477.0
          },
          {
            "x": 2.9,
            "y": 1477.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1498.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1519.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1541.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1562.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1584.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1605.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1627.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1648.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1670.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1691.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1713.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1734.5384615384614
          },
          {
            "x": 4.3,
            "y": 1756.0
          },
          {
            "x": 4.3,
            "y": 1756.0
          },
          {
            "x": 4.407692307692307,
            "y": 1778.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1801.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1824.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1847.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1870.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1893.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1916.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 1939.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 1962.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 1985.2307692307693
          },
          {
            "x": 5.484615384615385,
            "y": 2008.1538461538462
          },
          {
            "x": 5.592307692307692,
            "y": 2031.076923076923
          },
          {
            "x": 5.7,
            "y": 2054.0
          },
          {
            "x": 5.7,
            "y": 2054.0
          },
          {
            "x": 5.816666666666666,
            "y": 2080.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2106.3333333333335
          },
          {
            "x": 6.05,
            "y": 2132.5
          },
          {
            "x": 6.166666666666667,
            "y": 2158.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2184.8333333333335
          },
          {
            "x": 6.4,
            "y": 2211.0
          },
          {
            "x": 6.516666666666667,
            "y": 2237.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2263.3333333333335
          },
          {
            "x": 6.75,
            "y": 2289.5
          },
          {
            "x": 6.866666666666666,
            "y": 2315.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2341.8333333333335
          },
          {
            "x": 7.1,
            "y": 2368.0
          },
          {
            "x": 7.1,
            "y": 2368.0
          },
          {
            "x": 7.207142857142856,
            "y": 2391.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2414.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2438.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2461.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2484.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2508.1428571428573
          },
          {
            "x": 7.85,
            "y": 2531.5
          },
          {
            "x": 7.957142857142856,
            "y": 2554.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2578.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2601.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2624.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2648.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2671.6428571428573
          },
          {
            "x": 8.6,
            "y": 2695.0
          },
          {
            "x": 8.6,
            "y": 2695.0
          },
          {
            "x": 8.707692307692307,
            "y": 2721.0
          },
          {
            "x": 8.815384615384614,
            "y": 2747.0
          },
          {
            "x": 8.923076923076923,
            "y": 2773.0
          },
          {
            "x": 9.03076923076923,
            "y": 2799.0
          },
          {
            "x": 9.138461538461538,
            "y": 2825.0
          },
          {
            "x": 9.246153846153845,
            "y": 2851.0
          },
          {
            "x": 9.353846153846154,
            "y": 2877.0
          },
          {
            "x": 9.461538461538462,
            "y": 2903.0
          },
          {
            "x": 9.569230769230769,
            "y": 2929.0
          },
          {
            "x": 9.676923076923076,
            "y": 2955.0
          },
          {
            "x": 9.784615384615385,
            "y": 2981.0
          },
          {
            "x": 9.892307692307693,
            "y": 3007.0
          },
          {
            "x": 10.0,
            "y": 3033.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1033,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1226,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1477,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1756,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2054,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2368,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2695,
        "time": "17:56"
      },
      {
        "name": "仙丈ヶ岳山頂",
        "distance": 10.0,
        "elevation": 3033,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1033,
      "summit_elevation": 3033
    }
  },
  "鳳凰三山": {
    "mountain": "鳳凰三山",
    "datasets": [
      {
        "label": "鳳凰三山 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1014.8333333333334
          },
          {
            "x": 0.21666666666666667,
            "y": 1029.6666666666667
          },
          {
            "x": 0.325,
            "y": 1044.5
          },
          {
            "x": 0.43333333333333335,
            "y": 1059.3333333333333
          },
          {
            "x": 0.5416666666666667,
            "y": 1074.1666666666667
          },
          {
            "x": 0.65,
            "y": 1089.0
          },
          {
            "x": 0.7583333333333334,
            "y": 1103.8333333333333
          },
          {
            "x": 0.8666666666666667,
            "y": 1118.6666666666667
          },
          {
            "x": 0.9750000000000001,
            "y": 1133.5
          },
          {
            "x": 1.0833333333333335,
            "y": 1148.3333333333333
          },
          {
            "x": 1.1916666666666667,
            "y": 1163.1666666666667
          },
          {
            "x": 1.3,
            "y": 1178.0
          },
          {
            "x": 1.3,
            "y": 1178.0
          },
          {
            "x": 1.4083333333333334,
            "y": 1197.25
          },
          {
            "x": 1.5166666666666666,
            "y": 1216.5
          },
          {
            "x": 1.625,
            "y": 1235.75
          },
          {
            "x": 1.7333333333333334,
            "y": 1255.0
          },
          {
            "x": 1.8416666666666668,
            "y": 1274.25
          },
          {
            "x": 1.9500000000000002,
            "y": 1293.5
          },
          {
            "x": 2.0583333333333336,
            "y": 1312.75
          },
          {
            "x": 2.166666666666667,
            "y": 1332.0
          },
          {
            "x": 2.2750000000000004,
            "y": 1351.25
          },
          {
            "x": 2.3833333333333337,
            "y": 1370.5
          },
          {
            "x": 2.4916666666666667,
            "y": 1389.75
          },
          {
            "x": 2.6,
            "y": 1409.0
          },
          {
            "x": 2.6,
            "y": 1409.0
          },
          {
            "x": 2.7181818181818183,
            "y": 1432.2727272727273
          },
          {
            "x": 2.8363636363636364,
            "y": 1455.5454545454545
          },
          {
            "x": 2.9545454545454546,
            "y": 1478.8181818181818
          },
          {
            "x": 3.0727272727272728,
            "y": 1502.090909090909
          },
          {
            "x": 3.190909090909091,
            "y": 1525.3636363636363
          },
          {
            "x": 3.309090909090909,
            "y": 1548.6363636363635
          },
          {
            "x": 3.4272727272727272,
            "y": 1571.909090909091
          },
          {
            "x": 3.5454545454545454,
            "y": 1595.1818181818182
          },
          {
            "x": 3.6636363636363636,
            "y": 1618.4545454545455
          },
          {
            "x": 3.7818181818181817,
            "y": 1641.7272727272727
          },
          {
            "x": 3.9,
            "y": 1665.0
          },
          {
            "x": 3.9,
            "y": 1665.0
          },
          {
            "x": 4.007692307692308,
            "y": 1686.1538461538462
          },
          {
            "x": 4.115384615384615,
            "y": 1707.3076923076924
          },
          {
            "x": 4.223076923076923,
            "y": 1728.4615384615386
          },
          {
            "x": 4.3307692307692305,
            "y": 1749.6153846153845
          },
          {
            "x": 4.438461538461539,
            "y": 1770.7692307692307
          },
          {
            "x": 4.546153846153846,
            "y": 1791.923076923077
          },
          {
            "x": 4.653846153846153,
            "y": 1813.076923076923
          },
          {
            "x": 4.7615384615384615,
            "y": 1834.2307692307693
          },
          {
            "x": 4.869230769230769,
            "y": 1855.3846153846155
          },
          {
            "x": 4.976923076923077,
            "y": 1876.5384615384614
          },
          {
            "x": 5.084615384615384,
            "y": 1897.6923076923076
          },
          {
            "x": 5.1923076923076925,
            "y": 1918.8461538461538
          },
          {
            "x": 5.3,
            "y": 1940.0
          },
          {
            "x": 5.3,
            "y": 1940.0
          },
          {
            "x": 5.418181818181818,
            "y": 1966.1818181818182
          },
          {
            "x": 5.536363636363636,
            "y": 1992.3636363636363
          },
          {
            "x": 5.654545454545454,
            "y": 2018.5454545454545
          },
          {
            "x": 5.7727272727272725,
            "y": 2044.7272727272727
          },
          {
            "x": 5.890909090909091,
            "y": 2070.909090909091
          },
          {
            "x": 6.009090909090909,
            "y": 2097.090909090909
          },
          {
            "x": 6.127272727272727,
            "y": 2123.2727272727275
          },
          {
            "x": 6.245454545454545,
            "y": 2149.4545454545455
          },
          {
            "x": 6.363636363636363,
            "y": 2175.6363636363635
          },
          {
            "x": 6.4818181818181815,
            "y": 2201.818181818182
          },
          {
            "x": 6.6,
            "y": 2228.0
          },
          {
            "x": 6.6,
            "y": 2228.0
          },
          {
            "x": 6.708333333333333,
            "y": 2253.0833333333335
          },
          {
            "x": 6.816666666666666,
            "y": 2278.1666666666665
          },
          {
            "x": 6.925,
            "y": 2303.25
          },
          {
            "x": 7.033333333333333,
            "y": 2328.3333333333335
          },
          {
            "x": 7.141666666666667,
            "y": 2353.4166666666665
          },
          {
            "x": 7.25,
            "y": 2378.5
          },
          {
            "x": 7.358333333333333,
            "y": 2403.5833333333335
          },
          {
            "x": 7.466666666666667,
            "y": 2428.6666666666665
          },
          {
            "x": 7.575,
            "y": 2453.75
          },
          {
            "x": 7.683333333333334,
            "y": 2478.8333333333335
          },
          {
            "x": 7.791666666666667,
            "y": 2503.9166666666665
          },
          {
            "x": 7.9,
            "y": 2529.0
          },
          {
            "x": 7.9,
            "y": 2529.0
          },
          {
            "x": 8.018181818181818,
            "y": 2557.2727272727275
          },
          {
            "x": 8.136363636363637,
            "y": 2585.5454545454545
          },
          {
            "x": 8.254545454545454,
            "y": 2613.818181818182
          },
          {
            "x": 8.372727272727273,
            "y": 2642.090909090909
          },
          {
            "x": 8.49090909090909,
            "y": 2670.3636363636365
          },
          {
            "x": 8.60909090909091,
            "y": 2698.6363636363635
          },
          {
            "x": 8.727272727272727,
            "y": 2726.909090909091
          },
          {
            "x": 8.845454545454546,
            "y": 2755.181818181818
          },
          {
            "x": 8.963636363636363,
            "y": 2783.4545454545455
          },
          {
            "x": 9.081818181818182,
            "y": 2811.7272727272725
          },
          {
            "x": 9.2,
            "y": 2840.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1178,
        "time": "07:45"
      },
      {
        "name": "登山道2合目",
        "distance": 2.6,
        "elevation": 1409,
        "time": "09:33"
      },
      {
        "name": "中間地点3",
        "distance": 3.9,
        "elevation": 1665,
        "time": "11:23"
      },
      {
        "name": "中間地点4",
        "distance": 5.3,
        "elevation": 1940,
        "time": "13:14"
      },
      {
        "name": "山頂付近5",
        "distance": 6.6,
        "elevation": 2228,
        "time": "15:06"
      },
      {
        "name": "山頂付近6",
        "distance": 7.9,
        "elevation": 2529,
        "time": "16:59"
      },
      {
        "name": "鳳凰三山山頂",
        "distance": 9.2,
        "elevation": 2840,
        "time": "18:52"
      }
    ],
    "stats": {
      "total_distance": 9.2,
      "elevation_gain": 1840,
      "base_elevation": 1000,
      "summit_elevation": 2840
    }
  },
  "塩見岳": {
    "mountain": "塩見岳",
    "datasets": [
      {
        "label": "塩見岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1047.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1061.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1076.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1091.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1106.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1121.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1136.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1150.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1165.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1180.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1195.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1210.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1225.1538461538462
          },
          {
            "x": 1.4,
            "y": 1240.0
          },
          {
            "x": 1.4,
            "y": 1240.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1257.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1275.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1293.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1311.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1329.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1347.5714285714287
          },
          {
            "x": 2.15,
            "y": 1365.5
          },
          {
            "x": 2.257142857142857,
            "y": 1383.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1401.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1419.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1437.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1455.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1473.0714285714287
          },
          {
            "x": 2.9,
            "y": 1491.0
          },
          {
            "x": 2.9,
            "y": 1491.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1512.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1533.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1555.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1576.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1598.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1619.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1641.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1662.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1684.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1705.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1727.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1748.5384615384614
          },
          {
            "x": 4.3,
            "y": 1770.0
          },
          {
            "x": 4.3,
            "y": 1770.0
          },
          {
            "x": 4.407692307692307,
            "y": 1792.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1815.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1838.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1861.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1884.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1907.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1930.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 1953.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 1976.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 1999.2307692307693
          },
          {
            "x": 5.484615384615385,
            "y": 2022.1538461538462
          },
          {
            "x": 5.592307692307692,
            "y": 2045.076923076923
          },
          {
            "x": 5.7,
            "y": 2068.0
          },
          {
            "x": 5.7,
            "y": 2068.0
          },
          {
            "x": 5.816666666666666,
            "y": 2094.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2120.3333333333335
          },
          {
            "x": 6.05,
            "y": 2146.5
          },
          {
            "x": 6.166666666666667,
            "y": 2172.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2198.8333333333335
          },
          {
            "x": 6.4,
            "y": 2225.0
          },
          {
            "x": 6.516666666666667,
            "y": 2251.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2277.3333333333335
          },
          {
            "x": 6.75,
            "y": 2303.5
          },
          {
            "x": 6.866666666666666,
            "y": 2329.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2355.8333333333335
          },
          {
            "x": 7.1,
            "y": 2382.0
          },
          {
            "x": 7.1,
            "y": 2382.0
          },
          {
            "x": 7.207142857142856,
            "y": 2405.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2428.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2452.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2475.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2498.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2522.1428571428573
          },
          {
            "x": 7.85,
            "y": 2545.5
          },
          {
            "x": 7.957142857142856,
            "y": 2568.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2592.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2615.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2638.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2662.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2685.6428571428573
          },
          {
            "x": 8.6,
            "y": 2709.0
          },
          {
            "x": 8.6,
            "y": 2709.0
          },
          {
            "x": 8.707692307692307,
            "y": 2735.0
          },
          {
            "x": 8.815384615384614,
            "y": 2761.0
          },
          {
            "x": 8.923076923076923,
            "y": 2787.0
          },
          {
            "x": 9.03076923076923,
            "y": 2813.0
          },
          {
            "x": 9.138461538461538,
            "y": 2839.0
          },
          {
            "x": 9.246153846153845,
            "y": 2865.0
          },
          {
            "x": 9.353846153846154,
            "y": 2891.0
          },
          {
            "x": 9.461538461538462,
            "y": 2917.0
          },
          {
            "x": 9.569230769230769,
            "y": 2943.0
          },
          {
            "x": 9.676923076923076,
            "y": 2969.0
          },
          {
            "x": 9.784615384615385,
            "y": 2995.0
          },
          {
            "x": 9.892307692307693,
            "y": 3021.0
          },
          {
            "x": 10.0,
            "y": 3047.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1047,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1240,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1491,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1770,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2068,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2382,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2709,
        "time": "17:56"
      },
      {
        "name": "塩見岳山頂",
        "distance": 10.0,
        "elevation": 3047,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1047,
      "summit_elevation": 3047
    }
  },
  "農鳥岳": {
    "mountain": "農鳥岳",
    "datasets": [
      {
        "label": "農鳥岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1026.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1040.8461538461538
          },
          {
            "x": 0.2153846153846154,
            "y": 1055.6923076923076
          },
          {
            "x": 0.3230769230769231,
            "y": 1070.5384615384614
          },
          {
            "x": 0.4307692307692308,
            "y": 1085.3846153846155
          },
          {
            "x": 0.5384615384615384,
            "y": 1100.2307692307693
          },
          {
            "x": 0.6461538461538462,
            "y": 1115.076923076923
          },
          {
            "x": 0.7538461538461537,
            "y": 1129.923076923077
          },
          {
            "x": 0.8615384615384616,
            "y": 1144.7692307692307
          },
          {
            "x": 0.9692307692307691,
            "y": 1159.6153846153845
          },
          {
            "x": 1.0769230769230769,
            "y": 1174.4615384615386
          },
          {
            "x": 1.1846153846153846,
            "y": 1189.3076923076924
          },
          {
            "x": 1.2923076923076924,
            "y": 1204.1538461538462
          },
          {
            "x": 1.4,
            "y": 1219.0
          },
          {
            "x": 1.4,
            "y": 1219.0
          },
          {
            "x": 1.5071428571428571,
            "y": 1236.9285714285713
          },
          {
            "x": 1.614285714285714,
            "y": 1254.857142857143
          },
          {
            "x": 1.7214285714285713,
            "y": 1272.7857142857142
          },
          {
            "x": 1.8285714285714285,
            "y": 1290.7142857142858
          },
          {
            "x": 1.9357142857142855,
            "y": 1308.642857142857
          },
          {
            "x": 2.0428571428571427,
            "y": 1326.5714285714287
          },
          {
            "x": 2.15,
            "y": 1344.5
          },
          {
            "x": 2.257142857142857,
            "y": 1362.4285714285713
          },
          {
            "x": 2.3642857142857143,
            "y": 1380.357142857143
          },
          {
            "x": 2.4714285714285715,
            "y": 1398.2857142857142
          },
          {
            "x": 2.5785714285714283,
            "y": 1416.2142857142858
          },
          {
            "x": 2.6857142857142855,
            "y": 1434.142857142857
          },
          {
            "x": 2.7928571428571427,
            "y": 1452.0714285714287
          },
          {
            "x": 2.9,
            "y": 1470.0
          },
          {
            "x": 2.9,
            "y": 1470.0
          },
          {
            "x": 3.0076923076923077,
            "y": 1491.4615384615386
          },
          {
            "x": 3.1153846153846154,
            "y": 1512.923076923077
          },
          {
            "x": 3.223076923076923,
            "y": 1534.3846153846155
          },
          {
            "x": 3.3307692307692305,
            "y": 1555.8461538461538
          },
          {
            "x": 3.4384615384615382,
            "y": 1577.3076923076924
          },
          {
            "x": 3.546153846153846,
            "y": 1598.7692307692307
          },
          {
            "x": 3.6538461538461537,
            "y": 1620.2307692307693
          },
          {
            "x": 3.7615384615384615,
            "y": 1641.6923076923076
          },
          {
            "x": 3.869230769230769,
            "y": 1663.1538461538462
          },
          {
            "x": 3.976923076923077,
            "y": 1684.6153846153845
          },
          {
            "x": 4.084615384615384,
            "y": 1706.076923076923
          },
          {
            "x": 4.1923076923076925,
            "y": 1727.5384615384614
          },
          {
            "x": 4.3,
            "y": 1749.0
          },
          {
            "x": 4.3,
            "y": 1749.0
          },
          {
            "x": 4.407692307692307,
            "y": 1771.923076923077
          },
          {
            "x": 4.515384615384615,
            "y": 1794.8461538461538
          },
          {
            "x": 4.623076923076923,
            "y": 1817.7692307692307
          },
          {
            "x": 4.730769230769231,
            "y": 1840.6923076923076
          },
          {
            "x": 4.838461538461538,
            "y": 1863.6153846153845
          },
          {
            "x": 4.946153846153846,
            "y": 1886.5384615384614
          },
          {
            "x": 5.053846153846154,
            "y": 1909.4615384615386
          },
          {
            "x": 5.161538461538462,
            "y": 1932.3846153846155
          },
          {
            "x": 5.269230769230769,
            "y": 1955.3076923076924
          },
          {
            "x": 5.376923076923077,
            "y": 1978.2307692307693
          },
          {
            "x": 5.484615384615385,
            "y": 2001.1538461538462
          },
          {
            "x": 5.592307692307692,
            "y": 2024.076923076923
          },
          {
            "x": 5.7,
            "y": 2047.0
          },
          {
            "x": 5.7,
            "y": 2047.0
          },
          {
            "x": 5.816666666666666,
            "y": 2073.1666666666665
          },
          {
            "x": 5.933333333333334,
            "y": 2099.3333333333335
          },
          {
            "x": 6.05,
            "y": 2125.5
          },
          {
            "x": 6.166666666666667,
            "y": 2151.6666666666665
          },
          {
            "x": 6.283333333333333,
            "y": 2177.8333333333335
          },
          {
            "x": 6.4,
            "y": 2204.0
          },
          {
            "x": 6.516666666666667,
            "y": 2230.1666666666665
          },
          {
            "x": 6.633333333333333,
            "y": 2256.3333333333335
          },
          {
            "x": 6.75,
            "y": 2282.5
          },
          {
            "x": 6.866666666666666,
            "y": 2308.6666666666665
          },
          {
            "x": 6.9833333333333325,
            "y": 2334.8333333333335
          },
          {
            "x": 7.1,
            "y": 2361.0
          },
          {
            "x": 7.1,
            "y": 2361.0
          },
          {
            "x": 7.207142857142856,
            "y": 2384.3571428571427
          },
          {
            "x": 7.314285714285714,
            "y": 2407.714285714286
          },
          {
            "x": 7.421428571428571,
            "y": 2431.0714285714284
          },
          {
            "x": 7.5285714285714285,
            "y": 2454.4285714285716
          },
          {
            "x": 7.635714285714285,
            "y": 2477.785714285714
          },
          {
            "x": 7.742857142857142,
            "y": 2501.1428571428573
          },
          {
            "x": 7.85,
            "y": 2524.5
          },
          {
            "x": 7.957142857142856,
            "y": 2547.8571428571427
          },
          {
            "x": 8.064285714285713,
            "y": 2571.214285714286
          },
          {
            "x": 8.17142857142857,
            "y": 2594.5714285714284
          },
          {
            "x": 8.278571428571428,
            "y": 2617.9285714285716
          },
          {
            "x": 8.385714285714286,
            "y": 2641.285714285714
          },
          {
            "x": 8.492857142857142,
            "y": 2664.6428571428573
          },
          {
            "x": 8.6,
            "y": 2688.0
          },
          {
            "x": 8.6,
            "y": 2688.0
          },
          {
            "x": 8.707692307692307,
            "y": 2714.0
          },
          {
            "x": 8.815384615384614,
            "y": 2740.0
          },
          {
            "x": 8.923076923076923,
            "y": 2766.0
          },
          {
            "x": 9.03076923076923,
            "y": 2792.0
          },
          {
            "x": 9.138461538461538,
            "y": 2818.0
          },
          {
            "x": 9.246153846153845,
            "y": 2844.0
          },
          {
            "x": 9.353846153846154,
            "y": 2870.0
          },
          {
            "x": 9.461538461538462,
            "y": 2896.0
          },
          {
            "x": 9.569230769230769,
            "y": 2922.0
          },
          {
            "x": 9.676923076923076,
            "y": 2948.0
          },
          {
            "x": 9.784615384615385,
            "y": 2974.0
          },
          {
            "x": 9.892307692307693,
            "y": 3000.0
          },
          {
            "x": 10.0,
            "y": 3026.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1026,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1219,
        "time": "07:54"
      },
      {
        "name": "登山道2合目",
        "distance": 2.9,
        "elevation": 1470,
        "time": "09:52"
      },
      {
        "name": "中間地点3",
        "distance": 4.3,
        "elevation": 1749,
        "time": "11:51"
      },
      {
        "name": "中間地点4",
        "distance": 5.7,
        "elevation": 2047,
        "time": "13:52"
      },
      {
        "name": "山頂付近5",
        "distance": 7.1,
        "elevation": 2361,
        "time": "15:54"
      },
      {
        "name": "山頂付近6",
        "distance": 8.6,
        "elevation": 2688,
        "time": "17:56"
      },
      {
        "name": "農鳥岳山頂",
        "distance": 10.0,
        "elevation": 3026,
        "time": "20:00"
      }
    ],
    "stats": {
      "total_distance": 10.0,
      "elevation_gain": 2000,
      "base_elevation": 1026,
      "summit_elevation": 3026
    }
  },
  "西穂高岳": {
    "mountain": "西穂高岳",
    "datasets": [
      {
        "label": "西穂高岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.1538461538462
          },
          {
            "x": 0.2153846153846154,
            "y": 1028.3076923076924
          },
          {
            "x": 0.3230769230769231,
            "y": 1042.4615384615386
          },
          {
            "x": 0.4307692307692308,
            "y": 1056.6153846153845
          },
          {
            "x": 0.5384615384615384,
            "y": 1070.7692307692307
          },
          {
            "x": 0.6461538461538462,
            "y": 1084.923076923077
          },
          {
            "x": 0.7538461538461537,
            "y": 1099.076923076923
          },
          {
            "x": 0.8615384615384616,
            "y": 1113.2307692307693
          },
          {
            "x": 0.9692307692307691,
            "y": 1127.3846153846155
          },
          {
            "x": 1.0769230769230769,
            "y": 1141.5384615384614
          },
          {
            "x": 1.1846153846153846,
            "y": 1155.6923076923076
          },
          {
            "x": 1.2923076923076924,
            "y": 1169.8461538461538
          },
          {
            "x": 1.4,
            "y": 1184.0
          },
          {
            "x": 1.4,
            "y": 1184.0
          },
          {
            "x": 1.5083333333333333,
            "y": 1204.0
          },
          {
            "x": 1.6166666666666667,
            "y": 1224.0
          },
          {
            "x": 1.725,
            "y": 1244.0
          },
          {
            "x": 1.8333333333333333,
            "y": 1264.0
          },
          {
            "x": 1.9416666666666669,
            "y": 1284.0
          },
          {
            "x": 2.05,
            "y": 1304.0
          },
          {
            "x": 2.158333333333333,
            "y": 1324.0
          },
          {
            "x": 2.2666666666666666,
            "y": 1344.0
          },
          {
            "x": 2.375,
            "y": 1364.0
          },
          {
            "x": 2.4833333333333334,
            "y": 1384.0
          },
          {
            "x": 2.591666666666667,
            "y": 1404.0
          },
          {
            "x": 2.7,
            "y": 1424.0
          },
          {
            "x": 2.7,
            "y": 1424.0
          },
          {
            "x": 2.816666666666667,
            "y": 1446.1666666666667
          },
          {
            "x": 2.9333333333333336,
            "y": 1468.3333333333333
          },
          {
            "x": 3.05,
            "y": 1490.5
          },
          {
            "x": 3.1666666666666665,
            "y": 1512.6666666666667
          },
          {
            "x": 3.283333333333333,
            "y": 1534.8333333333333
          },
          {
            "x": 3.4,
            "y": 1557.0
          },
          {
            "x": 3.5166666666666666,
            "y": 1579.1666666666667
          },
          {
            "x": 3.633333333333333,
            "y": 1601.3333333333333
          },
          {
            "x": 3.75,
            "y": 1623.5
          },
          {
            "x": 3.8666666666666663,
            "y": 1645.6666666666667
          },
          {
            "x": 3.983333333333333,
            "y": 1667.8333333333333
          },
          {
            "x": 4.1,
            "y": 1690.0
          },
          {
            "x": 4.1,
            "y": 1690.0
          },
          {
            "x": 4.208333333333333,
            "y": 1713.75
          },
          {
            "x": 4.316666666666666,
            "y": 1737.5
          },
          {
            "x": 4.425,
            "y": 1761.25
          },
          {
            "x": 4.533333333333333,
            "y": 1785.0
          },
          {
            "x": 4.641666666666667,
            "y": 1808.75
          },
          {
            "x": 4.75,
            "y": 1832.5
          },
          {
            "x": 4.858333333333333,
            "y": 1856.25
          },
          {
            "x": 4.966666666666667,
            "y": 1880.0
          },
          {
            "x": 5.075,
            "y": 1903.75
          },
          {
            "x": 5.183333333333334,
            "y": 1927.5
          },
          {
            "x": 5.291666666666667,
            "y": 1951.25
          },
          {
            "x": 5.4,
            "y": 1975.0
          },
          {
            "x": 5.4,
            "y": 1975.0
          },
          {
            "x": 5.516666666666667,
            "y": 1999.9166666666667
          },
          {
            "x": 5.633333333333334,
            "y": 2024.8333333333333
          },
          {
            "x": 5.75,
            "y": 2049.75
          },
          {
            "x": 5.866666666666667,
            "y": 2074.6666666666665
          },
          {
            "x": 5.983333333333333,
            "y": 2099.5833333333335
          },
          {
            "x": 6.1,
            "y": 2124.5
          },
          {
            "x": 6.216666666666667,
            "y": 2149.4166666666665
          },
          {
            "x": 6.333333333333333,
            "y": 2174.3333333333335
          },
          {
            "x": 6.45,
            "y": 2199.25
          },
          {
            "x": 6.566666666666666,
            "y": 2224.1666666666665
          },
          {
            "x": 6.683333333333334,
            "y": 2249.0833333333335
          },
          {
            "x": 6.8,
            "y": 2274.0
          },
          {
            "x": 6.8,
            "y": 2274.0
          },
          {
            "x": 6.918181818181818,
            "y": 2302.3636363636365
          },
          {
            "x": 7.036363636363636,
            "y": 2330.7272727272725
          },
          {
            "x": 7.154545454545454,
            "y": 2359.090909090909
          },
          {
            "x": 7.2727272727272725,
            "y": 2387.4545454545455
          },
          {
            "x": 7.390909090909091,
            "y": 2415.818181818182
          },
          {
            "x": 7.509090909090909,
            "y": 2444.181818181818
          },
          {
            "x": 7.627272727272727,
            "y": 2472.5454545454545
          },
          {
            "x": 7.745454545454545,
            "y": 2500.909090909091
          },
          {
            "x": 7.863636363636363,
            "y": 2529.2727272727275
          },
          {
            "x": 7.9818181818181815,
            "y": 2557.6363636363635
          },
          {
            "x": 8.1,
            "y": 2586.0
          },
          {
            "x": 8.1,
            "y": 2586.0
          },
          {
            "x": 8.207692307692307,
            "y": 2610.846153846154
          },
          {
            "x": 8.315384615384614,
            "y": 2635.6923076923076
          },
          {
            "x": 8.423076923076923,
            "y": 2660.5384615384614
          },
          {
            "x": 8.53076923076923,
            "y": 2685.3846153846152
          },
          {
            "x": 8.638461538461538,
            "y": 2710.230769230769
          },
          {
            "x": 8.746153846153845,
            "y": 2735.076923076923
          },
          {
            "x": 8.853846153846154,
            "y": 2759.923076923077
          },
          {
            "x": 8.961538461538462,
            "y": 2784.769230769231
          },
          {
            "x": 9.069230769230769,
            "y": 2809.6153846153848
          },
          {
            "x": 9.176923076923076,
            "y": 2834.4615384615386
          },
          {
            "x": 9.284615384615385,
            "y": 2859.3076923076924
          },
          {
            "x": 9.392307692307693,
            "y": 2884.153846153846
          },
          {
            "x": 9.5,
            "y": 2909.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1184,
        "time": "07:48"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1424,
        "time": "09:40"
      },
      {
        "name": "中間地点3",
        "distance": 4.1,
        "elevation": 1690,
        "time": "11:34"
      },
      {
        "name": "中間地点4",
        "distance": 5.4,
        "elevation": 1975,
        "time": "13:29"
      },
      {
        "name": "山頂付近5",
        "distance": 6.8,
        "elevation": 2274,
        "time": "15:25"
      },
      {
        "name": "山頂付近6",
        "distance": 8.1,
        "elevation": 2586,
        "time": "17:21"
      },
      {
        "name": "西穂高岳山頂",
        "distance": 9.5,
        "elevation": 2909,
        "time": "19:18"
      }
    ],
    "stats": {
      "total_distance": 9.5,
      "elevation_gain": 1909,
      "base_elevation": 1000,
      "summit_elevation": 2909
    }
  },
  "燕岳": {
    "mountain": "燕岳",
    "datasets": [
      {
        "label": "燕岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1014.1666666666666
          },
          {
            "x": 0.21666666666666667,
            "y": 1028.3333333333333
          },
          {
            "x": 0.325,
            "y": 1042.5
          },
          {
            "x": 0.43333333333333335,
            "y": 1056.6666666666667
          },
          {
            "x": 0.5416666666666667,
            "y": 1070.8333333333333
          },
          {
            "x": 0.65,
            "y": 1085.0
          },
          {
            "x": 0.7583333333333334,
            "y": 1099.1666666666667
          },
          {
            "x": 0.8666666666666667,
            "y": 1113.3333333333333
          },
          {
            "x": 0.9750000000000001,
            "y": 1127.5
          },
          {
            "x": 1.0833333333333335,
            "y": 1141.6666666666667
          },
          {
            "x": 1.1916666666666667,
            "y": 1155.8333333333333
          },
          {
            "x": 1.3,
            "y": 1170.0
          },
          {
            "x": 1.3,
            "y": 1170.0
          },
          {
            "x": 1.4090909090909092,
            "y": 1190.1818181818182
          },
          {
            "x": 1.5181818181818183,
            "y": 1210.3636363636363
          },
          {
            "x": 1.6272727272727272,
            "y": 1230.5454545454545
          },
          {
            "x": 1.7363636363636363,
            "y": 1250.7272727272727
          },
          {
            "x": 1.8454545454545455,
            "y": 1270.909090909091
          },
          {
            "x": 1.9545454545454546,
            "y": 1291.090909090909
          },
          {
            "x": 2.0636363636363635,
            "y": 1311.2727272727273
          },
          {
            "x": 2.172727272727273,
            "y": 1331.4545454545455
          },
          {
            "x": 2.2818181818181817,
            "y": 1351.6363636363637
          },
          {
            "x": 2.3909090909090907,
            "y": 1371.8181818181818
          },
          {
            "x": 2.5,
            "y": 1392.0
          },
          {
            "x": 2.5,
            "y": 1392.0
          },
          {
            "x": 2.618181818181818,
            "y": 1414.2727272727273
          },
          {
            "x": 2.7363636363636363,
            "y": 1436.5454545454545
          },
          {
            "x": 2.8545454545454545,
            "y": 1458.8181818181818
          },
          {
            "x": 2.9727272727272727,
            "y": 1481.090909090909
          },
          {
            "x": 3.090909090909091,
            "y": 1503.3636363636363
          },
          {
            "x": 3.209090909090909,
            "y": 1525.6363636363635
          },
          {
            "x": 3.327272727272727,
            "y": 1547.909090909091
          },
          {
            "x": 3.4454545454545453,
            "y": 1570.1818181818182
          },
          {
            "x": 3.5636363636363635,
            "y": 1592.4545454545455
          },
          {
            "x": 3.6818181818181817,
            "y": 1614.7272727272727
          },
          {
            "x": 3.8,
            "y": 1637.0
          },
          {
            "x": 3.8,
            "y": 1637.0
          },
          {
            "x": 3.9090909090909087,
            "y": 1660.909090909091
          },
          {
            "x": 4.018181818181818,
            "y": 1684.8181818181818
          },
          {
            "x": 4.127272727272727,
            "y": 1708.7272727272727
          },
          {
            "x": 4.236363636363636,
            "y": 1732.6363636363637
          },
          {
            "x": 4.345454545454546,
            "y": 1756.5454545454545
          },
          {
            "x": 4.454545454545454,
            "y": 1780.4545454545455
          },
          {
            "x": 4.5636363636363635,
            "y": 1804.3636363636365
          },
          {
            "x": 4.672727272727273,
            "y": 1828.2727272727273
          },
          {
            "x": 4.781818181818182,
            "y": 1852.1818181818182
          },
          {
            "x": 4.890909090909091,
            "y": 1876.090909090909
          },
          {
            "x": 5.0,
            "y": 1900.0
          },
          {
            "x": 5.0,
            "y": 1900.0
          },
          {
            "x": 5.118181818181818,
            "y": 1925.1818181818182
          },
          {
            "x": 5.236363636363636,
            "y": 1950.3636363636363
          },
          {
            "x": 5.3545454545454545,
            "y": 1975.5454545454545
          },
          {
            "x": 5.472727272727273,
            "y": 2000.7272727272727
          },
          {
            "x": 5.590909090909091,
            "y": 2025.909090909091
          },
          {
            "x": 5.709090909090909,
            "y": 2051.090909090909
          },
          {
            "x": 5.827272727272727,
            "y": 2076.2727272727275
          },
          {
            "x": 5.945454545454545,
            "y": 2101.4545454545455
          },
          {
            "x": 6.0636363636363635,
            "y": 2126.6363636363635
          },
          {
            "x": 6.181818181818182,
            "y": 2151.818181818182
          },
          {
            "x": 6.3,
            "y": 2177.0
          },
          {
            "x": 6.3,
            "y": 2177.0
          },
          {
            "x": 6.409090909090909,
            "y": 2203.181818181818
          },
          {
            "x": 6.518181818181818,
            "y": 2229.3636363636365
          },
          {
            "x": 6.627272727272727,
            "y": 2255.5454545454545
          },
          {
            "x": 6.736363636363636,
            "y": 2281.7272727272725
          },
          {
            "x": 6.845454545454546,
            "y": 2307.909090909091
          },
          {
            "x": 6.954545454545454,
            "y": 2334.090909090909
          },
          {
            "x": 7.0636363636363635,
            "y": 2360.2727272727275
          },
          {
            "x": 7.172727272727273,
            "y": 2386.4545454545455
          },
          {
            "x": 7.281818181818182,
            "y": 2412.6363636363635
          },
          {
            "x": 7.390909090909091,
            "y": 2438.818181818182
          },
          {
            "x": 7.5,
            "y": 2465.0
          },
          {
            "x": 7.5,
            "y": 2465.0
          },
          {
            "x": 7.608333333333333,
            "y": 2489.8333333333335
          },
          {
            "x": 7.716666666666667,
            "y": 2514.6666666666665
          },
          {
            "x": 7.825,
            "y": 2539.5
          },
          {
            "x": 7.933333333333334,
            "y": 2564.3333333333335
          },
          {
            "x": 8.041666666666668,
            "y": 2589.1666666666665
          },
          {
            "x": 8.15,
            "y": 2614.0
          },
          {
            "x": 8.258333333333333,
            "y": 2638.8333333333335
          },
          {
            "x": 8.366666666666667,
            "y": 2663.6666666666665
          },
          {
            "x": 8.475000000000001,
            "y": 2688.5
          },
          {
            "x": 8.583333333333334,
            "y": 2713.3333333333335
          },
          {
            "x": 8.691666666666666,
            "y": 2738.1666666666665
          },
          {
            "x": 8.8,
            "y": 2763.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1170,
        "time": "07:40"
      },
      {
        "name": "登山道2合目",
        "distance": 2.5,
        "elevation": 1392,
        "time": "09:24"
      },
      {
        "name": "中間地点3",
        "distance": 3.8,
        "elevation": 1637,
        "time": "11:09"
      },
      {
        "name": "中間地点4",
        "distance": 5.0,
        "elevation": 1900,
        "time": "12:56"
      },
      {
        "name": "山頂付近5",
        "distance": 6.3,
        "elevation": 2177,
        "time": "14:43"
      },
      {
        "name": "山頂付近6",
        "distance": 7.5,
        "elevation": 2465,
        "time": "16:30"
      },
      {
        "name": "燕岳山頂",
        "distance": 8.8,
        "elevation": 2763,
        "time": "18:19"
      }
    ],
    "stats": {
      "total_distance": 8.8,
      "elevation_gain": 1763,
      "base_elevation": 1000,
      "summit_elevation": 2763
    }
  },
  "蝶ヶ岳": {
    "mountain": "蝶ヶ岳",
    "datasets": [
      {
        "label": "蝶ヶ岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10909090909090909,
            "y": 1014.7272727272727
          },
          {
            "x": 0.21818181818181817,
            "y": 1029.4545454545455
          },
          {
            "x": 0.3272727272727272,
            "y": 1044.1818181818182
          },
          {
            "x": 0.43636363636363634,
            "y": 1058.909090909091
          },
          {
            "x": 0.5454545454545454,
            "y": 1073.6363636363637
          },
          {
            "x": 0.6545454545454544,
            "y": 1088.3636363636363
          },
          {
            "x": 0.7636363636363636,
            "y": 1103.090909090909
          },
          {
            "x": 0.8727272727272727,
            "y": 1117.8181818181818
          },
          {
            "x": 0.9818181818181818,
            "y": 1132.5454545454545
          },
          {
            "x": 1.0909090909090908,
            "y": 1147.2727272727273
          },
          {
            "x": 1.2,
            "y": 1162.0
          },
          {
            "x": 1.2,
            "y": 1162.0
          },
          {
            "x": 1.309090909090909,
            "y": 1181.090909090909
          },
          {
            "x": 1.4181818181818182,
            "y": 1200.1818181818182
          },
          {
            "x": 1.5272727272727271,
            "y": 1219.2727272727273
          },
          {
            "x": 1.6363636363636362,
            "y": 1238.3636363636363
          },
          {
            "x": 1.7454545454545454,
            "y": 1257.4545454545455
          },
          {
            "x": 1.8545454545454545,
            "y": 1276.5454545454545
          },
          {
            "x": 1.9636363636363634,
            "y": 1295.6363636363635
          },
          {
            "x": 2.0727272727272728,
            "y": 1314.7272727272727
          },
          {
            "x": 2.1818181818181817,
            "y": 1333.8181818181818
          },
          {
            "x": 2.290909090909091,
            "y": 1352.909090909091
          },
          {
            "x": 2.4,
            "y": 1372.0
          },
          {
            "x": 2.4,
            "y": 1372.0
          },
          {
            "x": 2.509090909090909,
            "y": 1393.2727272727273
          },
          {
            "x": 2.618181818181818,
            "y": 1414.5454545454545
          },
          {
            "x": 2.727272727272727,
            "y": 1435.8181818181818
          },
          {
            "x": 2.8363636363636364,
            "y": 1457.090909090909
          },
          {
            "x": 2.9454545454545453,
            "y": 1478.3636363636363
          },
          {
            "x": 3.0545454545454547,
            "y": 1499.6363636363635
          },
          {
            "x": 3.1636363636363636,
            "y": 1520.909090909091
          },
          {
            "x": 3.272727272727273,
            "y": 1542.1818181818182
          },
          {
            "x": 3.381818181818182,
            "y": 1563.4545454545455
          },
          {
            "x": 3.490909090909091,
            "y": 1584.7272727272727
          },
          {
            "x": 3.6,
            "y": 1606.0
          },
          {
            "x": 3.6,
            "y": 1606.0
          },
          {
            "x": 3.72,
            "y": 1631.0
          },
          {
            "x": 3.84,
            "y": 1656.0
          },
          {
            "x": 3.96,
            "y": 1681.0
          },
          {
            "x": 4.08,
            "y": 1706.0
          },
          {
            "x": 4.2,
            "y": 1731.0
          },
          {
            "x": 4.32,
            "y": 1756.0
          },
          {
            "x": 4.4399999999999995,
            "y": 1781.0
          },
          {
            "x": 4.56,
            "y": 1806.0
          },
          {
            "x": 4.68,
            "y": 1831.0
          },
          {
            "x": 4.8,
            "y": 1856.0
          },
          {
            "x": 4.8,
            "y": 1856.0
          },
          {
            "x": 4.909090909090909,
            "y": 1879.909090909091
          },
          {
            "x": 5.018181818181818,
            "y": 1903.8181818181818
          },
          {
            "x": 5.127272727272727,
            "y": 1927.7272727272727
          },
          {
            "x": 5.236363636363636,
            "y": 1951.6363636363637
          },
          {
            "x": 5.345454545454546,
            "y": 1975.5454545454545
          },
          {
            "x": 5.454545454545454,
            "y": 1999.4545454545455
          },
          {
            "x": 5.5636363636363635,
            "y": 2023.3636363636365
          },
          {
            "x": 5.672727272727273,
            "y": 2047.2727272727273
          },
          {
            "x": 5.781818181818182,
            "y": 2071.181818181818
          },
          {
            "x": 5.890909090909091,
            "y": 2095.090909090909
          },
          {
            "x": 6.0,
            "y": 2119.0
          },
          {
            "x": 6.0,
            "y": 2119.0
          },
          {
            "x": 6.109090909090909,
            "y": 2143.909090909091
          },
          {
            "x": 6.218181818181818,
            "y": 2168.818181818182
          },
          {
            "x": 6.327272727272727,
            "y": 2193.7272727272725
          },
          {
            "x": 6.4363636363636365,
            "y": 2218.6363636363635
          },
          {
            "x": 6.545454545454546,
            "y": 2243.5454545454545
          },
          {
            "x": 6.654545454545454,
            "y": 2268.4545454545455
          },
          {
            "x": 6.763636363636364,
            "y": 2293.3636363636365
          },
          {
            "x": 6.872727272727273,
            "y": 2318.2727272727275
          },
          {
            "x": 6.981818181818182,
            "y": 2343.181818181818
          },
          {
            "x": 7.090909090909091,
            "y": 2368.090909090909
          },
          {
            "x": 7.2,
            "y": 2393.0
          },
          {
            "x": 7.2,
            "y": 2393.0
          },
          {
            "x": 7.3090909090909095,
            "y": 2418.818181818182
          },
          {
            "x": 7.418181818181818,
            "y": 2444.6363636363635
          },
          {
            "x": 7.527272727272727,
            "y": 2470.4545454545455
          },
          {
            "x": 7.636363636363637,
            "y": 2496.2727272727275
          },
          {
            "x": 7.745454545454546,
            "y": 2522.090909090909
          },
          {
            "x": 7.8545454545454545,
            "y": 2547.909090909091
          },
          {
            "x": 7.963636363636364,
            "y": 2573.7272727272725
          },
          {
            "x": 8.072727272727272,
            "y": 2599.5454545454545
          },
          {
            "x": 8.181818181818182,
            "y": 2625.3636363636365
          },
          {
            "x": 8.290909090909091,
            "y": 2651.181818181818
          },
          {
            "x": 8.4,
            "y": 2677.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.2,
        "elevation": 1162,
        "time": "07:36"
      },
      {
        "name": "登山道2合目",
        "distance": 2.4,
        "elevation": 1372,
        "time": "09:15"
      },
      {
        "name": "中間地点3",
        "distance": 3.6,
        "elevation": 1606,
        "time": "10:55"
      },
      {
        "name": "中間地点4",
        "distance": 4.8,
        "elevation": 1856,
        "time": "12:36"
      },
      {
        "name": "山頂付近5",
        "distance": 6.0,
        "elevation": 2119,
        "time": "14:19"
      },
      {
        "name": "山頂付近6",
        "distance": 7.2,
        "elevation": 2393,
        "time": "16:01"
      },
      {
        "name": "蝶ヶ岳山頂",
        "distance": 8.4,
        "elevation": 2677,
        "time": "17:45"
      }
    ],
    "stats": {
      "total_distance": 8.4,
      "elevation_gain": 1677,
      "base_elevation": 1000,
      "summit_elevation": 2677
    }
  },
  "双六岳": {
    "mountain": "双六岳",
    "datasets": [
      {
        "label": "双六岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1015.0
          },
          {
            "x": 0.21666666666666667,
            "y": 1030.0
          },
          {
            "x": 0.325,
            "y": 1045.0
          },
          {
            "x": 0.43333333333333335,
            "y": 1060.0
          },
          {
            "x": 0.5416666666666667,
            "y": 1075.0
          },
          {
            "x": 0.65,
            "y": 1090.0
          },
          {
            "x": 0.7583333333333334,
            "y": 1105.0
          },
          {
            "x": 0.8666666666666667,
            "y": 1120.0
          },
          {
            "x": 0.9750000000000001,
            "y": 1135.0
          },
          {
            "x": 1.0833333333333335,
            "y": 1150.0
          },
          {
            "x": 1.1916666666666667,
            "y": 1165.0
          },
          {
            "x": 1.3,
            "y": 1180.0
          },
          {
            "x": 1.3,
            "y": 1180.0
          },
          {
            "x": 1.4076923076923078,
            "y": 1197.923076923077
          },
          {
            "x": 1.5153846153846156,
            "y": 1215.8461538461538
          },
          {
            "x": 1.623076923076923,
            "y": 1233.7692307692307
          },
          {
            "x": 1.7307692307692308,
            "y": 1251.6923076923076
          },
          {
            "x": 1.8384615384615386,
            "y": 1269.6153846153845
          },
          {
            "x": 1.9461538461538463,
            "y": 1287.5384615384614
          },
          {
            "x": 2.0538461538461537,
            "y": 1305.4615384615386
          },
          {
            "x": 2.161538461538462,
            "y": 1323.3846153846155
          },
          {
            "x": 2.269230769230769,
            "y": 1341.3076923076924
          },
          {
            "x": 2.3769230769230774,
            "y": 1359.2307692307693
          },
          {
            "x": 2.4846153846153847,
            "y": 1377.1538461538462
          },
          {
            "x": 2.592307692307693,
            "y": 1395.076923076923
          },
          {
            "x": 2.7,
            "y": 1413.0
          },
          {
            "x": 2.7,
            "y": 1413.0
          },
          {
            "x": 2.8181818181818183,
            "y": 1436.5454545454545
          },
          {
            "x": 2.9363636363636365,
            "y": 1460.090909090909
          },
          {
            "x": 3.0545454545454547,
            "y": 1483.6363636363635
          },
          {
            "x": 3.172727272727273,
            "y": 1507.1818181818182
          },
          {
            "x": 3.290909090909091,
            "y": 1530.7272727272727
          },
          {
            "x": 3.409090909090909,
            "y": 1554.2727272727273
          },
          {
            "x": 3.5272727272727273,
            "y": 1577.8181818181818
          },
          {
            "x": 3.6454545454545455,
            "y": 1601.3636363636365
          },
          {
            "x": 3.7636363636363637,
            "y": 1624.909090909091
          },
          {
            "x": 3.881818181818182,
            "y": 1648.4545454545455
          },
          {
            "x": 4.0,
            "y": 1672.0
          },
          {
            "x": 4.0,
            "y": 1672.0
          },
          {
            "x": 4.118181818181818,
            "y": 1697.2727272727273
          },
          {
            "x": 4.236363636363636,
            "y": 1722.5454545454545
          },
          {
            "x": 4.3545454545454545,
            "y": 1747.8181818181818
          },
          {
            "x": 4.472727272727273,
            "y": 1773.090909090909
          },
          {
            "x": 4.590909090909091,
            "y": 1798.3636363636363
          },
          {
            "x": 4.709090909090909,
            "y": 1823.6363636363635
          },
          {
            "x": 4.827272727272727,
            "y": 1848.909090909091
          },
          {
            "x": 4.945454545454545,
            "y": 1874.1818181818182
          },
          {
            "x": 5.0636363636363635,
            "y": 1899.4545454545455
          },
          {
            "x": 5.181818181818182,
            "y": 1924.7272727272727
          },
          {
            "x": 5.3,
            "y": 1950.0
          },
          {
            "x": 5.3,
            "y": 1950.0
          },
          {
            "x": 5.418181818181818,
            "y": 1976.5454545454545
          },
          {
            "x": 5.536363636363636,
            "y": 2003.090909090909
          },
          {
            "x": 5.654545454545454,
            "y": 2029.6363636363635
          },
          {
            "x": 5.7727272727272725,
            "y": 2056.181818181818
          },
          {
            "x": 5.890909090909091,
            "y": 2082.7272727272725
          },
          {
            "x": 6.009090909090909,
            "y": 2109.272727272727
          },
          {
            "x": 6.127272727272727,
            "y": 2135.818181818182
          },
          {
            "x": 6.245454545454545,
            "y": 2162.3636363636365
          },
          {
            "x": 6.363636363636363,
            "y": 2188.909090909091
          },
          {
            "x": 6.4818181818181815,
            "y": 2215.4545454545455
          },
          {
            "x": 6.6,
            "y": 2242.0
          },
          {
            "x": 6.6,
            "y": 2242.0
          },
          {
            "x": 6.707692307692307,
            "y": 2265.3076923076924
          },
          {
            "x": 6.815384615384615,
            "y": 2288.6153846153848
          },
          {
            "x": 6.9230769230769225,
            "y": 2311.923076923077
          },
          {
            "x": 7.030769230769231,
            "y": 2335.230769230769
          },
          {
            "x": 7.138461538461538,
            "y": 2358.5384615384614
          },
          {
            "x": 7.246153846153846,
            "y": 2381.846153846154
          },
          {
            "x": 7.3538461538461535,
            "y": 2405.153846153846
          },
          {
            "x": 7.461538461538462,
            "y": 2428.4615384615386
          },
          {
            "x": 7.569230769230769,
            "y": 2451.769230769231
          },
          {
            "x": 7.676923076923077,
            "y": 2475.076923076923
          },
          {
            "x": 7.7846153846153845,
            "y": 2498.3846153846152
          },
          {
            "x": 7.892307692307693,
            "y": 2521.6923076923076
          },
          {
            "x": 8.0,
            "y": 2545.0
          },
          {
            "x": 8.0,
            "y": 2545.0
          },
          {
            "x": 8.108333333333334,
            "y": 2571.25
          },
          {
            "x": 8.216666666666667,
            "y": 2597.5
          },
          {
            "x": 8.325,
            "y": 2623.75
          },
          {
            "x": 8.433333333333334,
            "y": 2650.0
          },
          {
            "x": 8.541666666666668,
            "y": 2676.25
          },
          {
            "x": 8.65,
            "y": 2702.5
          },
          {
            "x": 8.758333333333333,
            "y": 2728.75
          },
          {
            "x": 8.866666666666667,
            "y": 2755.0
          },
          {
            "x": 8.975000000000001,
            "y": 2781.25
          },
          {
            "x": 9.083333333333334,
            "y": 2807.5
          },
          {
            "x": 9.191666666666666,
            "y": 2833.75
          },
          {
            "x": 9.3,
            "y": 2860.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1180,
        "time": "07:46"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1413,
        "time": "09:36"
      },
      {
        "name": "中間地点3",
        "distance": 4.0,
        "elevation": 1672,
        "time": "11:27"
      },
      {
        "name": "中間地点4",
        "distance": 5.3,
        "elevation": 1950,
        "time": "13:19"
      },
      {
        "name": "山頂付近5",
        "distance": 6.6,
        "elevation": 2242,
        "time": "15:12"
      },
      {
        "name": "山頂付近6",
        "distance": 8.0,
        "elevation": 2545,
        "time": "17:06"
      },
      {
        "name": "双六岳山頂",
        "distance": 9.3,
        "elevation": 2860,
        "time": "19:01"
      }
    ],
    "stats": {
      "total_distance": 9.3,
      "elevation_gain": 1860,
      "base_elevation": 1000,
      "summit_elevation": 2860
    }
  },
  "三俣蓮華岳": {
    "mountain": "三俣蓮華岳",
    "datasets": [
      {
        "label": "三俣蓮華岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1014.8333333333334
          },
          {
            "x": 0.21666666666666667,
            "y": 1029.6666666666667
          },
          {
            "x": 0.325,
            "y": 1044.5
          },
          {
            "x": 0.43333333333333335,
            "y": 1059.3333333333333
          },
          {
            "x": 0.5416666666666667,
            "y": 1074.1666666666667
          },
          {
            "x": 0.65,
            "y": 1089.0
          },
          {
            "x": 0.7583333333333334,
            "y": 1103.8333333333333
          },
          {
            "x": 0.8666666666666667,
            "y": 1118.6666666666667
          },
          {
            "x": 0.9750000000000001,
            "y": 1133.5
          },
          {
            "x": 1.0833333333333335,
            "y": 1148.3333333333333
          },
          {
            "x": 1.1916666666666667,
            "y": 1163.1666666666667
          },
          {
            "x": 1.3,
            "y": 1178.0
          },
          {
            "x": 1.3,
            "y": 1178.0
          },
          {
            "x": 1.4083333333333334,
            "y": 1197.25
          },
          {
            "x": 1.5166666666666666,
            "y": 1216.5
          },
          {
            "x": 1.625,
            "y": 1235.75
          },
          {
            "x": 1.7333333333333334,
            "y": 1255.0
          },
          {
            "x": 1.8416666666666668,
            "y": 1274.25
          },
          {
            "x": 1.9500000000000002,
            "y": 1293.5
          },
          {
            "x": 2.0583333333333336,
            "y": 1312.75
          },
          {
            "x": 2.166666666666667,
            "y": 1332.0
          },
          {
            "x": 2.2750000000000004,
            "y": 1351.25
          },
          {
            "x": 2.3833333333333337,
            "y": 1370.5
          },
          {
            "x": 2.4916666666666667,
            "y": 1389.75
          },
          {
            "x": 2.6,
            "y": 1409.0
          },
          {
            "x": 2.6,
            "y": 1409.0
          },
          {
            "x": 2.7181818181818183,
            "y": 1432.3636363636363
          },
          {
            "x": 2.8363636363636364,
            "y": 1455.7272727272727
          },
          {
            "x": 2.9545454545454546,
            "y": 1479.090909090909
          },
          {
            "x": 3.0727272727272728,
            "y": 1502.4545454545455
          },
          {
            "x": 3.190909090909091,
            "y": 1525.8181818181818
          },
          {
            "x": 3.309090909090909,
            "y": 1549.1818181818182
          },
          {
            "x": 3.4272727272727272,
            "y": 1572.5454545454545
          },
          {
            "x": 3.5454545454545454,
            "y": 1595.909090909091
          },
          {
            "x": 3.6636363636363636,
            "y": 1619.2727272727273
          },
          {
            "x": 3.7818181818181817,
            "y": 1642.6363636363635
          },
          {
            "x": 3.9,
            "y": 1666.0
          },
          {
            "x": 3.9,
            "y": 1666.0
          },
          {
            "x": 4.007692307692308,
            "y": 1687.076923076923
          },
          {
            "x": 4.115384615384615,
            "y": 1708.1538461538462
          },
          {
            "x": 4.223076923076923,
            "y": 1729.2307692307693
          },
          {
            "x": 4.3307692307692305,
            "y": 1750.3076923076924
          },
          {
            "x": 4.438461538461539,
            "y": 1771.3846153846155
          },
          {
            "x": 4.546153846153846,
            "y": 1792.4615384615386
          },
          {
            "x": 4.653846153846153,
            "y": 1813.5384615384614
          },
          {
            "x": 4.7615384615384615,
            "y": 1834.6153846153845
          },
          {
            "x": 4.869230769230769,
            "y": 1855.6923076923076
          },
          {
            "x": 4.976923076923077,
            "y": 1876.7692307692307
          },
          {
            "x": 5.084615384615384,
            "y": 1897.8461538461538
          },
          {
            "x": 5.1923076923076925,
            "y": 1918.923076923077
          },
          {
            "x": 5.3,
            "y": 1940.0
          },
          {
            "x": 5.3,
            "y": 1940.0
          },
          {
            "x": 5.418181818181818,
            "y": 1966.2727272727273
          },
          {
            "x": 5.536363636363636,
            "y": 1992.5454545454545
          },
          {
            "x": 5.654545454545454,
            "y": 2018.8181818181818
          },
          {
            "x": 5.7727272727272725,
            "y": 2045.090909090909
          },
          {
            "x": 5.890909090909091,
            "y": 2071.3636363636365
          },
          {
            "x": 6.009090909090909,
            "y": 2097.6363636363635
          },
          {
            "x": 6.127272727272727,
            "y": 2123.909090909091
          },
          {
            "x": 6.245454545454545,
            "y": 2150.181818181818
          },
          {
            "x": 6.363636363636363,
            "y": 2176.4545454545455
          },
          {
            "x": 6.4818181818181815,
            "y": 2202.7272727272725
          },
          {
            "x": 6.6,
            "y": 2229.0
          },
          {
            "x": 6.6,
            "y": 2229.0
          },
          {
            "x": 6.708333333333333,
            "y": 2254.0833333333335
          },
          {
            "x": 6.816666666666666,
            "y": 2279.1666666666665
          },
          {
            "x": 6.925,
            "y": 2304.25
          },
          {
            "x": 7.033333333333333,
            "y": 2329.3333333333335
          },
          {
            "x": 7.141666666666667,
            "y": 2354.4166666666665
          },
          {
            "x": 7.25,
            "y": 2379.5
          },
          {
            "x": 7.358333333333333,
            "y": 2404.5833333333335
          },
          {
            "x": 7.466666666666667,
            "y": 2429.6666666666665
          },
          {
            "x": 7.575,
            "y": 2454.75
          },
          {
            "x": 7.683333333333334,
            "y": 2479.8333333333335
          },
          {
            "x": 7.791666666666667,
            "y": 2504.9166666666665
          },
          {
            "x": 7.9,
            "y": 2530.0
          },
          {
            "x": 7.9,
            "y": 2530.0
          },
          {
            "x": 8.018181818181818,
            "y": 2558.2727272727275
          },
          {
            "x": 8.136363636363637,
            "y": 2586.5454545454545
          },
          {
            "x": 8.254545454545454,
            "y": 2614.818181818182
          },
          {
            "x": 8.372727272727273,
            "y": 2643.090909090909
          },
          {
            "x": 8.49090909090909,
            "y": 2671.3636363636365
          },
          {
            "x": 8.60909090909091,
            "y": 2699.6363636363635
          },
          {
            "x": 8.727272727272727,
            "y": 2727.909090909091
          },
          {
            "x": 8.845454545454546,
            "y": 2756.181818181818
          },
          {
            "x": 8.963636363636363,
            "y": 2784.4545454545455
          },
          {
            "x": 9.081818181818182,
            "y": 2812.7272727272725
          },
          {
            "x": 9.2,
            "y": 2841.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1178,
        "time": "07:45"
      },
      {
        "name": "登山道2合目",
        "distance": 2.6,
        "elevation": 1409,
        "time": "09:33"
      },
      {
        "name": "中間地点3",
        "distance": 3.9,
        "elevation": 1666,
        "time": "11:23"
      },
      {
        "name": "中間地点4",
        "distance": 5.3,
        "elevation": 1940,
        "time": "13:14"
      },
      {
        "name": "山頂付近5",
        "distance": 6.6,
        "elevation": 2229,
        "time": "15:06"
      },
      {
        "name": "山頂付近6",
        "distance": 7.9,
        "elevation": 2530,
        "time": "16:59"
      },
      {
        "name": "三俣蓮華岳山頂",
        "distance": 9.2,
        "elevation": 2841,
        "time": "18:52"
      }
    ],
    "stats": {
      "total_distance": 9.2,
      "elevation_gain": 1841,
      "base_elevation": 1000,
      "summit_elevation": 2841
    }
  },
  "雲ノ平": {
    "mountain": "雲ノ平",
    "datasets": [
      {
        "label": "雲ノ平 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10909090909090909,
            "y": 1014.9090909090909
          },
          {
            "x": 0.21818181818181817,
            "y": 1029.8181818181818
          },
          {
            "x": 0.3272727272727272,
            "y": 1044.7272727272727
          },
          {
            "x": 0.43636363636363634,
            "y": 1059.6363636363637
          },
          {
            "x": 0.5454545454545454,
            "y": 1074.5454545454545
          },
          {
            "x": 0.6545454545454544,
            "y": 1089.4545454545455
          },
          {
            "x": 0.7636363636363636,
            "y": 1104.3636363636363
          },
          {
            "x": 0.8727272727272727,
            "y": 1119.2727272727273
          },
          {
            "x": 0.9818181818181818,
            "y": 1134.1818181818182
          },
          {
            "x": 1.0909090909090908,
            "y": 1149.090909090909
          },
          {
            "x": 1.2,
            "y": 1164.0
          },
          {
            "x": 1.2,
            "y": 1164.0
          },
          {
            "x": 1.309090909090909,
            "y": 1183.4545454545455
          },
          {
            "x": 1.4181818181818182,
            "y": 1202.909090909091
          },
          {
            "x": 1.5272727272727271,
            "y": 1222.3636363636363
          },
          {
            "x": 1.6363636363636362,
            "y": 1241.8181818181818
          },
          {
            "x": 1.7454545454545454,
            "y": 1261.2727272727273
          },
          {
            "x": 1.8545454545454545,
            "y": 1280.7272727272727
          },
          {
            "x": 1.9636363636363634,
            "y": 1300.1818181818182
          },
          {
            "x": 2.0727272727272728,
            "y": 1319.6363636363637
          },
          {
            "x": 2.1818181818181817,
            "y": 1339.090909090909
          },
          {
            "x": 2.290909090909091,
            "y": 1358.5454545454545
          },
          {
            "x": 2.4,
            "y": 1378.0
          },
          {
            "x": 2.4,
            "y": 1378.0
          },
          {
            "x": 2.509090909090909,
            "y": 1399.5454545454545
          },
          {
            "x": 2.618181818181818,
            "y": 1421.090909090909
          },
          {
            "x": 2.727272727272727,
            "y": 1442.6363636363635
          },
          {
            "x": 2.8363636363636364,
            "y": 1464.1818181818182
          },
          {
            "x": 2.9454545454545453,
            "y": 1485.7272727272727
          },
          {
            "x": 3.0545454545454547,
            "y": 1507.2727272727273
          },
          {
            "x": 3.1636363636363636,
            "y": 1528.8181818181818
          },
          {
            "x": 3.272727272727273,
            "y": 1550.3636363636365
          },
          {
            "x": 3.381818181818182,
            "y": 1571.909090909091
          },
          {
            "x": 3.490909090909091,
            "y": 1593.4545454545455
          },
          {
            "x": 3.6,
            "y": 1615.0
          },
          {
            "x": 3.6,
            "y": 1615.0
          },
          {
            "x": 3.7083333333333335,
            "y": 1636.0833333333333
          },
          {
            "x": 3.816666666666667,
            "y": 1657.1666666666667
          },
          {
            "x": 3.9250000000000003,
            "y": 1678.25
          },
          {
            "x": 4.033333333333333,
            "y": 1699.3333333333333
          },
          {
            "x": 4.141666666666667,
            "y": 1720.4166666666667
          },
          {
            "x": 4.25,
            "y": 1741.5
          },
          {
            "x": 4.358333333333333,
            "y": 1762.5833333333333
          },
          {
            "x": 4.466666666666667,
            "y": 1783.6666666666667
          },
          {
            "x": 4.575,
            "y": 1804.75
          },
          {
            "x": 4.683333333333334,
            "y": 1825.8333333333333
          },
          {
            "x": 4.791666666666667,
            "y": 1846.9166666666667
          },
          {
            "x": 4.9,
            "y": 1868.0
          },
          {
            "x": 4.9,
            "y": 1868.0
          },
          {
            "x": 5.0200000000000005,
            "y": 1894.7
          },
          {
            "x": 5.140000000000001,
            "y": 1921.4
          },
          {
            "x": 5.26,
            "y": 1948.1
          },
          {
            "x": 5.38,
            "y": 1974.8
          },
          {
            "x": 5.5,
            "y": 2001.5
          },
          {
            "x": 5.62,
            "y": 2028.2
          },
          {
            "x": 5.74,
            "y": 2054.9
          },
          {
            "x": 5.859999999999999,
            "y": 2081.6
          },
          {
            "x": 5.9799999999999995,
            "y": 2108.3
          },
          {
            "x": 6.1,
            "y": 2135.0
          },
          {
            "x": 6.1,
            "y": 2135.0
          },
          {
            "x": 6.209090909090909,
            "y": 2160.181818181818
          },
          {
            "x": 6.3181818181818175,
            "y": 2185.3636363636365
          },
          {
            "x": 6.427272727272727,
            "y": 2210.5454545454545
          },
          {
            "x": 6.536363636363636,
            "y": 2235.7272727272725
          },
          {
            "x": 6.6454545454545455,
            "y": 2260.909090909091
          },
          {
            "x": 6.754545454545454,
            "y": 2286.090909090909
          },
          {
            "x": 6.863636363636363,
            "y": 2311.2727272727275
          },
          {
            "x": 6.972727272727273,
            "y": 2336.4545454545455
          },
          {
            "x": 7.081818181818182,
            "y": 2361.6363636363635
          },
          {
            "x": 7.1909090909090905,
            "y": 2386.818181818182
          },
          {
            "x": 7.3,
            "y": 2412.0
          },
          {
            "x": 7.3,
            "y": 2412.0
          },
          {
            "x": 7.409090909090909,
            "y": 2438.181818181818
          },
          {
            "x": 7.518181818181818,
            "y": 2464.3636363636365
          },
          {
            "x": 7.627272727272727,
            "y": 2490.5454545454545
          },
          {
            "x": 7.736363636363636,
            "y": 2516.7272727272725
          },
          {
            "x": 7.845454545454546,
            "y": 2542.909090909091
          },
          {
            "x": 7.954545454545454,
            "y": 2569.090909090909
          },
          {
            "x": 8.063636363636364,
            "y": 2595.2727272727275
          },
          {
            "x": 8.172727272727272,
            "y": 2621.4545454545455
          },
          {
            "x": 8.281818181818181,
            "y": 2647.6363636363635
          },
          {
            "x": 8.39090909090909,
            "y": 2673.818181818182
          },
          {
            "x": 8.5,
            "y": 2700.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.2,
        "elevation": 1164,
        "time": "07:37"
      },
      {
        "name": "登山道2合目",
        "distance": 2.4,
        "elevation": 1378,
        "time": "09:17"
      },
      {
        "name": "中間地点3",
        "distance": 3.6,
        "elevation": 1615,
        "time": "10:59"
      },
      {
        "name": "中間地点4",
        "distance": 4.9,
        "elevation": 1868,
        "time": "12:41"
      },
      {
        "name": "山頂付近5",
        "distance": 6.1,
        "elevation": 2135,
        "time": "14:25"
      },
      {
        "name": "山頂付近6",
        "distance": 7.3,
        "elevation": 2412,
        "time": "16:09"
      },
      {
        "name": "雲ノ平山頂",
        "distance": 8.5,
        "elevation": 2700,
        "time": "17:53"
      }
    ],
    "stats": {
      "total_distance": 8.5,
      "elevation_gain": 1700,
      "base_elevation": 1000,
      "summit_elevation": 2700
    }
  },
  "別山": {
    "mountain": "別山",
    "datasets": [
      {
        "label": "別山 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1015.0833333333334
          },
          {
            "x": 0.21666666666666667,
            "y": 1030.1666666666667
          },
          {
            "x": 0.325,
            "y": 1045.25
          },
          {
            "x": 0.43333333333333335,
            "y": 1060.3333333333333
          },
          {
            "x": 0.5416666666666667,
            "y": 1075.4166666666667
          },
          {
            "x": 0.65,
            "y": 1090.5
          },
          {
            "x": 0.7583333333333334,
            "y": 1105.5833333333333
          },
          {
            "x": 0.8666666666666667,
            "y": 1120.6666666666667
          },
          {
            "x": 0.9750000000000001,
            "y": 1135.75
          },
          {
            "x": 1.0833333333333335,
            "y": 1150.8333333333333
          },
          {
            "x": 1.1916666666666667,
            "y": 1165.9166666666667
          },
          {
            "x": 1.3,
            "y": 1181.0
          },
          {
            "x": 1.3,
            "y": 1181.0
          },
          {
            "x": 1.4076923076923078,
            "y": 1199.076923076923
          },
          {
            "x": 1.5153846153846156,
            "y": 1217.1538461538462
          },
          {
            "x": 1.623076923076923,
            "y": 1235.2307692307693
          },
          {
            "x": 1.7307692307692308,
            "y": 1253.3076923076924
          },
          {
            "x": 1.8384615384615386,
            "y": 1271.3846153846155
          },
          {
            "x": 1.9461538461538463,
            "y": 1289.4615384615386
          },
          {
            "x": 2.0538461538461537,
            "y": 1307.5384615384614
          },
          {
            "x": 2.161538461538462,
            "y": 1325.6153846153845
          },
          {
            "x": 2.269230769230769,
            "y": 1343.6923076923076
          },
          {
            "x": 2.3769230769230774,
            "y": 1361.7692307692307
          },
          {
            "x": 2.4846153846153847,
            "y": 1379.8461538461538
          },
          {
            "x": 2.592307692307693,
            "y": 1397.923076923077
          },
          {
            "x": 2.7,
            "y": 1416.0
          },
          {
            "x": 2.7,
            "y": 1416.0
          },
          {
            "x": 2.8181818181818183,
            "y": 1439.7272727272727
          },
          {
            "x": 2.9363636363636365,
            "y": 1463.4545454545455
          },
          {
            "x": 3.0545454545454547,
            "y": 1487.1818181818182
          },
          {
            "x": 3.172727272727273,
            "y": 1510.909090909091
          },
          {
            "x": 3.290909090909091,
            "y": 1534.6363636363635
          },
          {
            "x": 3.409090909090909,
            "y": 1558.3636363636363
          },
          {
            "x": 3.5272727272727273,
            "y": 1582.090909090909
          },
          {
            "x": 3.6454545454545455,
            "y": 1605.8181818181818
          },
          {
            "x": 3.7636363636363637,
            "y": 1629.5454545454545
          },
          {
            "x": 3.881818181818182,
            "y": 1653.2727272727273
          },
          {
            "x": 4.0,
            "y": 1677.0
          },
          {
            "x": 4.0,
            "y": 1677.0
          },
          {
            "x": 4.107692307692307,
            "y": 1698.5384615384614
          },
          {
            "x": 4.2153846153846155,
            "y": 1720.076923076923
          },
          {
            "x": 4.323076923076923,
            "y": 1741.6153846153845
          },
          {
            "x": 4.430769230769231,
            "y": 1763.1538461538462
          },
          {
            "x": 4.538461538461538,
            "y": 1784.6923076923076
          },
          {
            "x": 4.6461538461538465,
            "y": 1806.2307692307693
          },
          {
            "x": 4.753846153846154,
            "y": 1827.7692307692307
          },
          {
            "x": 4.861538461538462,
            "y": 1849.3076923076924
          },
          {
            "x": 4.969230769230769,
            "y": 1870.8461538461538
          },
          {
            "x": 5.0769230769230775,
            "y": 1892.3846153846155
          },
          {
            "x": 5.184615384615385,
            "y": 1913.923076923077
          },
          {
            "x": 5.292307692307693,
            "y": 1935.4615384615386
          },
          {
            "x": 5.4,
            "y": 1957.0
          },
          {
            "x": 5.4,
            "y": 1957.0
          },
          {
            "x": 5.5181818181818185,
            "y": 1983.7272727272727
          },
          {
            "x": 5.636363636363637,
            "y": 2010.4545454545455
          },
          {
            "x": 5.754545454545455,
            "y": 2037.1818181818182
          },
          {
            "x": 5.872727272727273,
            "y": 2063.909090909091
          },
          {
            "x": 5.990909090909091,
            "y": 2090.6363636363635
          },
          {
            "x": 6.109090909090909,
            "y": 2117.3636363636365
          },
          {
            "x": 6.2272727272727275,
            "y": 2144.090909090909
          },
          {
            "x": 6.345454545454546,
            "y": 2170.818181818182
          },
          {
            "x": 6.463636363636364,
            "y": 2197.5454545454545
          },
          {
            "x": 6.581818181818182,
            "y": 2224.272727272727
          },
          {
            "x": 6.7,
            "y": 2251.0
          },
          {
            "x": 6.7,
            "y": 2251.0
          },
          {
            "x": 6.816666666666666,
            "y": 2276.5
          },
          {
            "x": 6.933333333333334,
            "y": 2302.0
          },
          {
            "x": 7.05,
            "y": 2327.5
          },
          {
            "x": 7.166666666666667,
            "y": 2353.0
          },
          {
            "x": 7.283333333333333,
            "y": 2378.5
          },
          {
            "x": 7.4,
            "y": 2404.0
          },
          {
            "x": 7.516666666666667,
            "y": 2429.5
          },
          {
            "x": 7.633333333333333,
            "y": 2455.0
          },
          {
            "x": 7.75,
            "y": 2480.5
          },
          {
            "x": 7.866666666666666,
            "y": 2506.0
          },
          {
            "x": 7.9833333333333325,
            "y": 2531.5
          },
          {
            "x": 8.1,
            "y": 2557.0
          },
          {
            "x": 8.1,
            "y": 2557.0
          },
          {
            "x": 8.208333333333332,
            "y": 2583.4166666666665
          },
          {
            "x": 8.316666666666666,
            "y": 2609.8333333333335
          },
          {
            "x": 8.425,
            "y": 2636.25
          },
          {
            "x": 8.533333333333333,
            "y": 2662.6666666666665
          },
          {
            "x": 8.641666666666666,
            "y": 2689.0833333333335
          },
          {
            "x": 8.75,
            "y": 2715.5
          },
          {
            "x": 8.858333333333334,
            "y": 2741.9166666666665
          },
          {
            "x": 8.966666666666667,
            "y": 2768.3333333333335
          },
          {
            "x": 9.075,
            "y": 2794.75
          },
          {
            "x": 9.183333333333334,
            "y": 2821.1666666666665
          },
          {
            "x": 9.291666666666668,
            "y": 2847.5833333333335
          },
          {
            "x": 9.4,
            "y": 2874.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1181,
        "time": "07:47"
      },
      {
        "name": "登山道2合目",
        "distance": 2.7,
        "elevation": 1416,
        "time": "09:38"
      },
      {
        "name": "中間地点3",
        "distance": 4.0,
        "elevation": 1677,
        "time": "11:30"
      },
      {
        "name": "中間地点4",
        "distance": 5.4,
        "elevation": 1957,
        "time": "13:24"
      },
      {
        "name": "山頂付近5",
        "distance": 6.7,
        "elevation": 2251,
        "time": "15:18"
      },
      {
        "name": "山頂付近6",
        "distance": 8.1,
        "elevation": 2557,
        "time": "17:13"
      },
      {
        "name": "別山山頂",
        "distance": 9.4,
        "elevation": 2874,
        "time": "19:09"
      }
    ],
    "stats": {
      "total_distance": 9.4,
      "elevation_gain": 1874,
      "base_elevation": 1000,
      "summit_elevation": 2874
    }
  },
  "唐松岳": {
    "mountain": "唐松岳",
    "datasets": [
      {
        "label": "唐松岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10909090909090909,
            "y": 1014.9090909090909
          },
          {
            "x": 0.21818181818181817,
            "y": 1029.8181818181818
          },
          {
            "x": 0.3272727272727272,
            "y": 1044.7272727272727
          },
          {
            "x": 0.43636363636363634,
            "y": 1059.6363636363637
          },
          {
            "x": 0.5454545454545454,
            "y": 1074.5454545454545
          },
          {
            "x": 0.6545454545454544,
            "y": 1089.4545454545455
          },
          {
            "x": 0.7636363636363636,
            "y": 1104.3636363636363
          },
          {
            "x": 0.8727272727272727,
            "y": 1119.2727272727273
          },
          {
            "x": 0.9818181818181818,
            "y": 1134.1818181818182
          },
          {
            "x": 1.0909090909090908,
            "y": 1149.090909090909
          },
          {
            "x": 1.2,
            "y": 1164.0
          },
          {
            "x": 1.2,
            "y": 1164.0
          },
          {
            "x": 1.309090909090909,
            "y": 1183.3636363636363
          },
          {
            "x": 1.4181818181818182,
            "y": 1202.7272727272727
          },
          {
            "x": 1.5272727272727271,
            "y": 1222.090909090909
          },
          {
            "x": 1.6363636363636362,
            "y": 1241.4545454545455
          },
          {
            "x": 1.7454545454545454,
            "y": 1260.8181818181818
          },
          {
            "x": 1.8545454545454545,
            "y": 1280.1818181818182
          },
          {
            "x": 1.9636363636363634,
            "y": 1299.5454545454545
          },
          {
            "x": 2.0727272727272728,
            "y": 1318.909090909091
          },
          {
            "x": 2.1818181818181817,
            "y": 1338.2727272727273
          },
          {
            "x": 2.290909090909091,
            "y": 1357.6363636363635
          },
          {
            "x": 2.4,
            "y": 1377.0
          },
          {
            "x": 2.4,
            "y": 1377.0
          },
          {
            "x": 2.509090909090909,
            "y": 1398.4545454545455
          },
          {
            "x": 2.618181818181818,
            "y": 1419.909090909091
          },
          {
            "x": 2.727272727272727,
            "y": 1441.3636363636363
          },
          {
            "x": 2.8363636363636364,
            "y": 1462.8181818181818
          },
          {
            "x": 2.9454545454545453,
            "y": 1484.2727272727273
          },
          {
            "x": 3.0545454545454547,
            "y": 1505.7272727272727
          },
          {
            "x": 3.1636363636363636,
            "y": 1527.1818181818182
          },
          {
            "x": 3.272727272727273,
            "y": 1548.6363636363637
          },
          {
            "x": 3.381818181818182,
            "y": 1570.090909090909
          },
          {
            "x": 3.490909090909091,
            "y": 1591.5454545454545
          },
          {
            "x": 3.6,
            "y": 1613.0
          },
          {
            "x": 3.6,
            "y": 1613.0
          },
          {
            "x": 3.7083333333333335,
            "y": 1634.0833333333333
          },
          {
            "x": 3.816666666666667,
            "y": 1655.1666666666667
          },
          {
            "x": 3.9250000000000003,
            "y": 1676.25
          },
          {
            "x": 4.033333333333333,
            "y": 1697.3333333333333
          },
          {
            "x": 4.141666666666667,
            "y": 1718.4166666666667
          },
          {
            "x": 4.25,
            "y": 1739.5
          },
          {
            "x": 4.358333333333333,
            "y": 1760.5833333333333
          },
          {
            "x": 4.466666666666667,
            "y": 1781.6666666666667
          },
          {
            "x": 4.575,
            "y": 1802.75
          },
          {
            "x": 4.683333333333334,
            "y": 1823.8333333333333
          },
          {
            "x": 4.791666666666667,
            "y": 1844.9166666666667
          },
          {
            "x": 4.9,
            "y": 1866.0
          },
          {
            "x": 4.9,
            "y": 1866.0
          },
          {
            "x": 5.0200000000000005,
            "y": 1892.6
          },
          {
            "x": 5.140000000000001,
            "y": 1919.2
          },
          {
            "x": 5.26,
            "y": 1945.8
          },
          {
            "x": 5.38,
            "y": 1972.4
          },
          {
            "x": 5.5,
            "y": 1999.0
          },
          {
            "x": 5.62,
            "y": 2025.6
          },
          {
            "x": 5.74,
            "y": 2052.2
          },
          {
            "x": 5.859999999999999,
            "y": 2078.8
          },
          {
            "x": 5.9799999999999995,
            "y": 2105.4
          },
          {
            "x": 6.1,
            "y": 2132.0
          },
          {
            "x": 6.1,
            "y": 2132.0
          },
          {
            "x": 6.209090909090909,
            "y": 2157.181818181818
          },
          {
            "x": 6.3181818181818175,
            "y": 2182.3636363636365
          },
          {
            "x": 6.427272727272727,
            "y": 2207.5454545454545
          },
          {
            "x": 6.536363636363636,
            "y": 2232.7272727272725
          },
          {
            "x": 6.6454545454545455,
            "y": 2257.909090909091
          },
          {
            "x": 6.754545454545454,
            "y": 2283.090909090909
          },
          {
            "x": 6.863636363636363,
            "y": 2308.2727272727275
          },
          {
            "x": 6.972727272727273,
            "y": 2333.4545454545455
          },
          {
            "x": 7.081818181818182,
            "y": 2358.6363636363635
          },
          {
            "x": 7.1909090909090905,
            "y": 2383.818181818182
          },
          {
            "x": 7.3,
            "y": 2409.0
          },
          {
            "x": 7.3,
            "y": 2409.0
          },
          {
            "x": 7.409090909090909,
            "y": 2435.090909090909
          },
          {
            "x": 7.518181818181818,
            "y": 2461.181818181818
          },
          {
            "x": 7.627272727272727,
            "y": 2487.2727272727275
          },
          {
            "x": 7.736363636363636,
            "y": 2513.3636363636365
          },
          {
            "x": 7.845454545454546,
            "y": 2539.4545454545455
          },
          {
            "x": 7.954545454545454,
            "y": 2565.5454545454545
          },
          {
            "x": 8.063636363636364,
            "y": 2591.6363636363635
          },
          {
            "x": 8.172727272727272,
            "y": 2617.7272727272725
          },
          {
            "x": 8.281818181818181,
            "y": 2643.818181818182
          },
          {
            "x": 8.39090909090909,
            "y": 2669.909090909091
          },
          {
            "x": 8.5,
            "y": 2696.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.2,
        "elevation": 1164,
        "time": "07:37"
      },
      {
        "name": "登山道2合目",
        "distance": 2.4,
        "elevation": 1377,
        "time": "09:17"
      },
      {
        "name": "中間地点3",
        "distance": 3.6,
        "elevation": 1613,
        "time": "10:59"
      },
      {
        "name": "中間地点4",
        "distance": 4.9,
        "elevation": 1866,
        "time": "12:41"
      },
      {
        "name": "山頂付近5",
        "distance": 6.1,
        "elevation": 2132,
        "time": "14:25"
      },
      {
        "name": "山頂付近6",
        "distance": 7.3,
        "elevation": 2409,
        "time": "16:09"
      },
      {
        "name": "唐松岳山頂",
        "distance": 8.5,
        "elevation": 2696,
        "time": "17:53"
      }
    ],
    "stats": {
      "total_distance": 8.5,
      "elevation_gain": 1696,
      "base_elevation": 1000,
      "summit_elevation": 2696
    }
  },
  "蓮華岳": {
    "mountain": "蓮華岳",
    "datasets": [
      {
        "label": "蓮華岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1014.5
          },
          {
            "x": 0.21666666666666667,
            "y": 1029.0
          },
          {
            "x": 0.325,
            "y": 1043.5
          },
          {
            "x": 0.43333333333333335,
            "y": 1058.0
          },
          {
            "x": 0.5416666666666667,
            "y": 1072.5
          },
          {
            "x": 0.65,
            "y": 1087.0
          },
          {
            "x": 0.7583333333333334,
            "y": 1101.5
          },
          {
            "x": 0.8666666666666667,
            "y": 1116.0
          },
          {
            "x": 0.9750000000000001,
            "y": 1130.5
          },
          {
            "x": 1.0833333333333335,
            "y": 1145.0
          },
          {
            "x": 1.1916666666666667,
            "y": 1159.5
          },
          {
            "x": 1.3,
            "y": 1174.0
          },
          {
            "x": 1.3,
            "y": 1174.0
          },
          {
            "x": 1.4083333333333334,
            "y": 1192.8333333333333
          },
          {
            "x": 1.5166666666666666,
            "y": 1211.6666666666667
          },
          {
            "x": 1.625,
            "y": 1230.5
          },
          {
            "x": 1.7333333333333334,
            "y": 1249.3333333333333
          },
          {
            "x": 1.8416666666666668,
            "y": 1268.1666666666667
          },
          {
            "x": 1.9500000000000002,
            "y": 1287.0
          },
          {
            "x": 2.0583333333333336,
            "y": 1305.8333333333333
          },
          {
            "x": 2.166666666666667,
            "y": 1324.6666666666667
          },
          {
            "x": 2.2750000000000004,
            "y": 1343.5
          },
          {
            "x": 2.3833333333333337,
            "y": 1362.3333333333333
          },
          {
            "x": 2.4916666666666667,
            "y": 1381.1666666666667
          },
          {
            "x": 2.6,
            "y": 1400.0
          },
          {
            "x": 2.6,
            "y": 1400.0
          },
          {
            "x": 2.7181818181818183,
            "y": 1422.7272727272727
          },
          {
            "x": 2.8363636363636364,
            "y": 1445.4545454545455
          },
          {
            "x": 2.9545454545454546,
            "y": 1468.1818181818182
          },
          {
            "x": 3.0727272727272728,
            "y": 1490.909090909091
          },
          {
            "x": 3.190909090909091,
            "y": 1513.6363636363635
          },
          {
            "x": 3.309090909090909,
            "y": 1536.3636363636363
          },
          {
            "x": 3.4272727272727272,
            "y": 1559.090909090909
          },
          {
            "x": 3.5454545454545454,
            "y": 1581.8181818181818
          },
          {
            "x": 3.6636363636363636,
            "y": 1604.5454545454545
          },
          {
            "x": 3.7818181818181817,
            "y": 1627.2727272727273
          },
          {
            "x": 3.9,
            "y": 1650.0
          },
          {
            "x": 3.9,
            "y": 1650.0
          },
          {
            "x": 4.02,
            "y": 1676.9
          },
          {
            "x": 4.14,
            "y": 1703.8
          },
          {
            "x": 4.26,
            "y": 1730.7
          },
          {
            "x": 4.38,
            "y": 1757.6
          },
          {
            "x": 4.5,
            "y": 1784.5
          },
          {
            "x": 4.62,
            "y": 1811.4
          },
          {
            "x": 4.739999999999999,
            "y": 1838.3
          },
          {
            "x": 4.859999999999999,
            "y": 1865.2
          },
          {
            "x": 4.9799999999999995,
            "y": 1892.1
          },
          {
            "x": 5.1,
            "y": 1919.0
          },
          {
            "x": 5.1,
            "y": 1919.0
          },
          {
            "x": 5.208333333333333,
            "y": 1942.5
          },
          {
            "x": 5.316666666666666,
            "y": 1966.0
          },
          {
            "x": 5.425,
            "y": 1989.5
          },
          {
            "x": 5.533333333333333,
            "y": 2013.0
          },
          {
            "x": 5.641666666666667,
            "y": 2036.5
          },
          {
            "x": 5.75,
            "y": 2060.0
          },
          {
            "x": 5.858333333333333,
            "y": 2083.5
          },
          {
            "x": 5.966666666666667,
            "y": 2107.0
          },
          {
            "x": 6.075,
            "y": 2130.5
          },
          {
            "x": 6.183333333333334,
            "y": 2154.0
          },
          {
            "x": 6.291666666666667,
            "y": 2177.5
          },
          {
            "x": 6.4,
            "y": 2201.0
          },
          {
            "x": 6.4,
            "y": 2201.0
          },
          {
            "x": 6.5181818181818185,
            "y": 2227.7272727272725
          },
          {
            "x": 6.636363636363637,
            "y": 2254.4545454545455
          },
          {
            "x": 6.754545454545455,
            "y": 2281.181818181818
          },
          {
            "x": 6.872727272727273,
            "y": 2307.909090909091
          },
          {
            "x": 6.990909090909091,
            "y": 2334.6363636363635
          },
          {
            "x": 7.109090909090909,
            "y": 2361.3636363636365
          },
          {
            "x": 7.2272727272727275,
            "y": 2388.090909090909
          },
          {
            "x": 7.345454545454546,
            "y": 2414.818181818182
          },
          {
            "x": 7.463636363636364,
            "y": 2441.5454545454545
          },
          {
            "x": 7.581818181818182,
            "y": 2468.272727272727
          },
          {
            "x": 7.7,
            "y": 2495.0
          },
          {
            "x": 7.7,
            "y": 2495.0
          },
          {
            "x": 7.818181818181818,
            "y": 2522.6363636363635
          },
          {
            "x": 7.9363636363636365,
            "y": 2550.2727272727275
          },
          {
            "x": 8.054545454545455,
            "y": 2577.909090909091
          },
          {
            "x": 8.172727272727272,
            "y": 2605.5454545454545
          },
          {
            "x": 8.290909090909091,
            "y": 2633.181818181818
          },
          {
            "x": 8.40909090909091,
            "y": 2660.818181818182
          },
          {
            "x": 8.527272727272727,
            "y": 2688.4545454545455
          },
          {
            "x": 8.645454545454545,
            "y": 2716.090909090909
          },
          {
            "x": 8.763636363636364,
            "y": 2743.727272727273
          },
          {
            "x": 8.881818181818183,
            "y": 2771.3636363636365
          },
          {
            "x": 9.0,
            "y": 2799.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1174,
        "time": "07:43"
      },
      {
        "name": "登山道2合目",
        "distance": 2.6,
        "elevation": 1400,
        "time": "09:29"
      },
      {
        "name": "中間地点3",
        "distance": 3.9,
        "elevation": 1650,
        "time": "11:16"
      },
      {
        "name": "中間地点4",
        "distance": 5.1,
        "elevation": 1919,
        "time": "13:05"
      },
      {
        "name": "山頂付近5",
        "distance": 6.4,
        "elevation": 2201,
        "time": "14:54"
      },
      {
        "name": "山頂付近6",
        "distance": 7.7,
        "elevation": 2495,
        "time": "16:45"
      },
      {
        "name": "蓮華岳山頂",
        "distance": 9.0,
        "elevation": 2799,
        "time": "18:35"
      }
    ],
    "stats": {
      "total_distance": 9.0,
      "elevation_gain": 1799,
      "base_elevation": 1000,
      "summit_elevation": 2799
    }
  },
  "地蔵ヶ岳": {
    "mountain": "地蔵ヶ岳",
    "datasets": [
      {
        "label": "地蔵ヶ岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.10833333333333334,
            "y": 1014.1666666666666
          },
          {
            "x": 0.21666666666666667,
            "y": 1028.3333333333333
          },
          {
            "x": 0.325,
            "y": 1042.5
          },
          {
            "x": 0.43333333333333335,
            "y": 1056.6666666666667
          },
          {
            "x": 0.5416666666666667,
            "y": 1070.8333333333333
          },
          {
            "x": 0.65,
            "y": 1085.0
          },
          {
            "x": 0.7583333333333334,
            "y": 1099.1666666666667
          },
          {
            "x": 0.8666666666666667,
            "y": 1113.3333333333333
          },
          {
            "x": 0.9750000000000001,
            "y": 1127.5
          },
          {
            "x": 1.0833333333333335,
            "y": 1141.6666666666667
          },
          {
            "x": 1.1916666666666667,
            "y": 1155.8333333333333
          },
          {
            "x": 1.3,
            "y": 1170.0
          },
          {
            "x": 1.3,
            "y": 1170.0
          },
          {
            "x": 1.4090909090909092,
            "y": 1190.1818181818182
          },
          {
            "x": 1.5181818181818183,
            "y": 1210.3636363636363
          },
          {
            "x": 1.6272727272727272,
            "y": 1230.5454545454545
          },
          {
            "x": 1.7363636363636363,
            "y": 1250.7272727272727
          },
          {
            "x": 1.8454545454545455,
            "y": 1270.909090909091
          },
          {
            "x": 1.9545454545454546,
            "y": 1291.090909090909
          },
          {
            "x": 2.0636363636363635,
            "y": 1311.2727272727273
          },
          {
            "x": 2.172727272727273,
            "y": 1331.4545454545455
          },
          {
            "x": 2.2818181818181817,
            "y": 1351.6363636363637
          },
          {
            "x": 2.3909090909090907,
            "y": 1371.8181818181818
          },
          {
            "x": 2.5,
            "y": 1392.0
          },
          {
            "x": 2.5,
            "y": 1392.0
          },
          {
            "x": 2.618181818181818,
            "y": 1414.3636363636363
          },
          {
            "x": 2.7363636363636363,
            "y": 1436.7272727272727
          },
          {
            "x": 2.8545454545454545,
            "y": 1459.090909090909
          },
          {
            "x": 2.9727272727272727,
            "y": 1481.4545454545455
          },
          {
            "x": 3.090909090909091,
            "y": 1503.8181818181818
          },
          {
            "x": 3.209090909090909,
            "y": 1526.1818181818182
          },
          {
            "x": 3.327272727272727,
            "y": 1548.5454545454545
          },
          {
            "x": 3.4454545454545453,
            "y": 1570.909090909091
          },
          {
            "x": 3.5636363636363635,
            "y": 1593.2727272727273
          },
          {
            "x": 3.6818181818181817,
            "y": 1615.6363636363635
          },
          {
            "x": 3.8,
            "y": 1638.0
          },
          {
            "x": 3.8,
            "y": 1638.0
          },
          {
            "x": 3.9090909090909087,
            "y": 1661.909090909091
          },
          {
            "x": 4.018181818181818,
            "y": 1685.8181818181818
          },
          {
            "x": 4.127272727272727,
            "y": 1709.7272727272727
          },
          {
            "x": 4.236363636363636,
            "y": 1733.6363636363637
          },
          {
            "x": 4.345454545454546,
            "y": 1757.5454545454545
          },
          {
            "x": 4.454545454545454,
            "y": 1781.4545454545455
          },
          {
            "x": 4.5636363636363635,
            "y": 1805.3636363636365
          },
          {
            "x": 4.672727272727273,
            "y": 1829.2727272727273
          },
          {
            "x": 4.781818181818182,
            "y": 1853.1818181818182
          },
          {
            "x": 4.890909090909091,
            "y": 1877.090909090909
          },
          {
            "x": 5.0,
            "y": 1901.0
          },
          {
            "x": 5.0,
            "y": 1901.0
          },
          {
            "x": 5.118181818181818,
            "y": 1926.090909090909
          },
          {
            "x": 5.236363636363636,
            "y": 1951.1818181818182
          },
          {
            "x": 5.3545454545454545,
            "y": 1976.2727272727273
          },
          {
            "x": 5.472727272727273,
            "y": 2001.3636363636363
          },
          {
            "x": 5.590909090909091,
            "y": 2026.4545454545455
          },
          {
            "x": 5.709090909090909,
            "y": 2051.5454545454545
          },
          {
            "x": 5.827272727272727,
            "y": 2076.6363636363635
          },
          {
            "x": 5.945454545454545,
            "y": 2101.7272727272725
          },
          {
            "x": 6.0636363636363635,
            "y": 2126.818181818182
          },
          {
            "x": 6.181818181818182,
            "y": 2151.909090909091
          },
          {
            "x": 6.3,
            "y": 2177.0
          },
          {
            "x": 6.3,
            "y": 2177.0
          },
          {
            "x": 6.409090909090909,
            "y": 2203.2727272727275
          },
          {
            "x": 6.518181818181818,
            "y": 2229.5454545454545
          },
          {
            "x": 6.627272727272727,
            "y": 2255.818181818182
          },
          {
            "x": 6.736363636363636,
            "y": 2282.090909090909
          },
          {
            "x": 6.845454545454546,
            "y": 2308.3636363636365
          },
          {
            "x": 6.954545454545454,
            "y": 2334.6363636363635
          },
          {
            "x": 7.0636363636363635,
            "y": 2360.909090909091
          },
          {
            "x": 7.172727272727273,
            "y": 2387.181818181818
          },
          {
            "x": 7.281818181818182,
            "y": 2413.4545454545455
          },
          {
            "x": 7.390909090909091,
            "y": 2439.7272727272725
          },
          {
            "x": 7.5,
            "y": 2466.0
          },
          {
            "x": 7.5,
            "y": 2466.0
          },
          {
            "x": 7.608333333333333,
            "y": 2490.8333333333335
          },
          {
            "x": 7.716666666666667,
            "y": 2515.6666666666665
          },
          {
            "x": 7.825,
            "y": 2540.5
          },
          {
            "x": 7.933333333333334,
            "y": 2565.3333333333335
          },
          {
            "x": 8.041666666666668,
            "y": 2590.1666666666665
          },
          {
            "x": 8.15,
            "y": 2615.0
          },
          {
            "x": 8.258333333333333,
            "y": 2639.8333333333335
          },
          {
            "x": 8.366666666666667,
            "y": 2664.6666666666665
          },
          {
            "x": 8.475000000000001,
            "y": 2689.5
          },
          {
            "x": 8.583333333333334,
            "y": 2714.3333333333335
          },
          {
            "x": 8.691666666666666,
            "y": 2739.1666666666665
          },
          {
            "x": 8.8,
            "y": 2764.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.3,
        "elevation": 1170,
        "time": "07:40"
      },
      {
        "name": "登山道2合目",
        "distance": 2.5,
        "elevation": 1392,
        "time": "09:24"
      },
      {
        "name": "中間地点3",
        "distance": 3.8,
        "elevation": 1638,
        "time": "11:09"
      },
      {
        "name": "中間地点4",
        "distance": 5.0,
        "elevation": 1901,
        "time": "12:56"
      },
      {
        "name": "山頂付近5",
        "distance": 6.3,
        "elevation": 2177,
        "time": "14:43"
      },
      {
        "name": "山頂付近6",
        "distance": 7.5,
        "elevation": 2466,
        "time": "16:31"
      },
      {
        "name": "地蔵ヶ岳山頂",
        "distance": 8.8,
        "elevation": 2764,
        "time": "18:19"
      }
    ],
    "stats": {
      "total_distance": 8.8,
      "elevation_gain": 1764,
      "base_elevation": 1000,
      "summit_elevation": 2764
    }
  },
  "宝剣岳": {
    "mountain": "宝剣岳",
    "datasets": [
      {
        "label": "宝剣岳 標高プロファイル",
        "data": [
          {
            "x": 0.0,
            "y": 1000.0
          },
          {
            "x": 0.1076923076923077,
            "y": 1014.3076923076923
          },
          {
            "x": 0.2153846153846154,
            "y": 1028.6153846153845
          },
          {
            "x": 0.3230769230769231,
            "y": 1042.923076923077
          },
          {
            "x": 0.4307692307692308,
            "y": 1057.2307692307693
          },
          {
            "x": 0.5384615384615384,
            "y": 1071.5384615384614
          },
          {
            "x": 0.6461538461538462,
            "y": 1085.8461538461538
          },
          {
            "x": 0.7538461538461537,
            "y": 1100.1538461538462
          },
          {
            "x": 0.8615384615384616,
            "y": 1114.4615384615386
          },
          {
            "x": 0.9692307692307691,
            "y": 1128.7692307692307
          },
          {
            "x": 1.0769230769230769,
            "y": 1143.076923076923
          },
          {
            "x": 1.1846153846153846,
            "y": 1157.3846153846155
          },
          {
            "x": 1.2923076923076924,
            "y": 1171.6923076923076
          },
          {
            "x": 1.4,
            "y": 1186.0
          },
          {
            "x": 1.4,
            "y": 1186.0
          },
          {
            "x": 1.5076923076923077,
            "y": 1204.6923076923076
          },
          {
            "x": 1.6153846153846154,
            "y": 1223.3846153846155
          },
          {
            "x": 1.723076923076923,
            "y": 1242.076923076923
          },
          {
            "x": 1.8307692307692307,
            "y": 1260.7692307692307
          },
          {
            "x": 1.9384615384615382,
            "y": 1279.4615384615386
          },
          {
            "x": 2.046153846153846,
            "y": 1298.1538461538462
          },
          {
            "x": 2.1538461538461537,
            "y": 1316.8461538461538
          },
          {
            "x": 2.2615384615384615,
            "y": 1335.5384615384614
          },
          {
            "x": 2.369230769230769,
            "y": 1354.2307692307693
          },
          {
            "x": 2.476923076923077,
            "y": 1372.923076923077
          },
          {
            "x": 2.5846153846153843,
            "y": 1391.6153846153845
          },
          {
            "x": 2.6923076923076925,
            "y": 1410.3076923076924
          },
          {
            "x": 2.8,
            "y": 1429.0
          },
          {
            "x": 2.8,
            "y": 1429.0
          },
          {
            "x": 2.9076923076923076,
            "y": 1449.6923076923076
          },
          {
            "x": 3.0153846153846153,
            "y": 1470.3846153846155
          },
          {
            "x": 3.123076923076923,
            "y": 1491.076923076923
          },
          {
            "x": 3.230769230769231,
            "y": 1511.7692307692307
          },
          {
            "x": 3.3384615384615386,
            "y": 1532.4615384615386
          },
          {
            "x": 3.4461538461538463,
            "y": 1553.1538461538462
          },
          {
            "x": 3.5538461538461537,
            "y": 1573.8461538461538
          },
          {
            "x": 3.661538461538462,
            "y": 1594.5384615384614
          },
          {
            "x": 3.769230769230769,
            "y": 1615.2307692307693
          },
          {
            "x": 3.8769230769230774,
            "y": 1635.923076923077
          },
          {
            "x": 3.9846153846153847,
            "y": 1656.6153846153845
          },
          {
            "x": 4.092307692307692,
            "y": 1677.3076923076924
          },
          {
            "x": 4.2,
            "y": 1698.0
          },
          {
            "x": 4.2,
            "y": 1698.0
          },
          {
            "x": 4.318181818181818,
            "y": 1724.1818181818182
          },
          {
            "x": 4.4363636363636365,
            "y": 1750.3636363636363
          },
          {
            "x": 4.554545454545455,
            "y": 1776.5454545454545
          },
          {
            "x": 4.672727272727273,
            "y": 1802.7272727272727
          },
          {
            "x": 4.790909090909091,
            "y": 1828.909090909091
          },
          {
            "x": 4.909090909090909,
            "y": 1855.090909090909
          },
          {
            "x": 5.027272727272727,
            "y": 1881.2727272727273
          },
          {
            "x": 5.1454545454545455,
            "y": 1907.4545454545455
          },
          {
            "x": 5.263636363636364,
            "y": 1933.6363636363637
          },
          {
            "x": 5.381818181818182,
            "y": 1959.8181818181818
          },
          {
            "x": 5.5,
            "y": 1986.0
          },
          {
            "x": 5.5,
            "y": 1986.0
          },
          {
            "x": 5.607692307692307,
            "y": 2009.3076923076924
          },
          {
            "x": 5.7153846153846155,
            "y": 2032.6153846153845
          },
          {
            "x": 5.823076923076923,
            "y": 2055.923076923077
          },
          {
            "x": 5.930769230769231,
            "y": 2079.230769230769
          },
          {
            "x": 6.038461538461538,
            "y": 2102.5384615384614
          },
          {
            "x": 6.1461538461538465,
            "y": 2125.846153846154
          },
          {
            "x": 6.253846153846154,
            "y": 2149.153846153846
          },
          {
            "x": 6.361538461538462,
            "y": 2172.4615384615386
          },
          {
            "x": 6.469230769230769,
            "y": 2195.769230769231
          },
          {
            "x": 6.5769230769230775,
            "y": 2219.076923076923
          },
          {
            "x": 6.684615384615385,
            "y": 2242.3846153846152
          },
          {
            "x": 6.792307692307693,
            "y": 2265.6923076923076
          },
          {
            "x": 6.9,
            "y": 2289.0
          },
          {
            "x": 6.9,
            "y": 2289.0
          },
          {
            "x": 7.007692307692308,
            "y": 2313.230769230769
          },
          {
            "x": 7.115384615384616,
            "y": 2337.4615384615386
          },
          {
            "x": 7.223076923076923,
            "y": 2361.6923076923076
          },
          {
            "x": 7.330769230769231,
            "y": 2385.923076923077
          },
          {
            "x": 7.438461538461539,
            "y": 2410.153846153846
          },
          {
            "x": 7.546153846153847,
            "y": 2434.3846153846152
          },
          {
            "x": 7.653846153846154,
            "y": 2458.6153846153848
          },
          {
            "x": 7.761538461538462,
            "y": 2482.846153846154
          },
          {
            "x": 7.86923076923077,
            "y": 2507.076923076923
          },
          {
            "x": 7.976923076923078,
            "y": 2531.3076923076924
          },
          {
            "x": 8.084615384615386,
            "y": 2555.5384615384614
          },
          {
            "x": 8.192307692307693,
            "y": 2579.769230769231
          },
          {
            "x": 8.3,
            "y": 2604.0
          },
          {
            "x": 8.3,
            "y": 2604.0
          },
          {
            "x": 8.416666666666668,
            "y": 2631.25
          },
          {
            "x": 8.533333333333333,
            "y": 2658.5
          },
          {
            "x": 8.65,
            "y": 2685.75
          },
          {
            "x": 8.766666666666667,
            "y": 2713.0
          },
          {
            "x": 8.883333333333333,
            "y": 2740.25
          },
          {
            "x": 9.0,
            "y": 2767.5
          },
          {
            "x": 9.116666666666667,
            "y": 2794.75
          },
          {
            "x": 9.233333333333333,
            "y": 2822.0
          },
          {
            "x": 9.35,
            "y": 2849.25
          },
          {
            "x": 9.466666666666667,
            "y": 2876.5
          },
          {
            "x": 9.583333333333332,
            "y": 2903.75
          },
          {
            "x": 9.7,
            "y": 2931.0
          }
        ],
        "borderColor": "#2c5aa0",
        "backgroundColor": "rgba(44, 90, 160, 0.1)",
        "fill": true,
        "tension": 0.3,
        "pointRadius": 0,
        "pointHoverRadius": 6
      }
    ],
    "waypoints": [
      {
        "name": "登山口",
        "distance": 0.0,
        "elevation": 1000,
        "time": "06:00"
      },
      {
        "name": "登山道1合目",
        "distance": 1.4,
        "elevation": 1186,
        "time": "07:50"
      },
      {
        "name": "登山道2合目",
        "distance": 2.8,
        "elevation": 1429,
        "time": "09:45"
      },
      {
        "name": "中間地点3",
        "distance": 4.2,
        "elevation": 1698,
        "time": "11:41"
      },
      {
        "name": "中間地点4",
        "distance": 5.5,
        "elevation": 1986,
        "time": "13:38"
      },
      {
        "name": "山頂付近5",
        "distance": 6.9,
        "elevation": 2289,
        "time": "15:36"
      },
      {
        "name": "山頂付近6",
        "distance": 8.3,
        "elevation": 2604,
        "time": "17:34"
      },
      {
        "name": "宝剣岳山頂",
        "distance": 9.7,
        "elevation": 2931,
        "time": "19:34"
      }
    ],
    "stats": {
      "total_distance": 9.7,
      "elevation_gain": 1931,
      "base_elevation": 1000,
      "summit_elevation": 2931
    }
  }
};

// コースプロファイル表示関数（完全修正版）
function showCourseProfile(mountainName, event) {
    // イベントバブリングを完全に停止
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    
    console.log('🔧 showCourseProfile 呼び出し:', mountainName);
    
    const modal = document.getElementById('courseProfileModal');
    const modalTitle = document.getElementById('courseProfileModalLabel');
    const chartContainer = document.getElementById('modal-chart-container');
    
    if (!modal || !modalTitle || !chartContainer) {
        console.error('❌ モーダル要素が見つかりません');
        return false;
    }
    
    // モーダルタイトル更新
    modalTitle.textContent = `${mountainName} - コースプロファイル`;
    
    // プロファイルデータを取得
    const profileData = ALL_COURSE_PROFILE_DATA[mountainName];
    
    if (!profileData) {
        console.warn('⚠️ プロファイルデータが見つかりません:', mountainName);
        chartContainer.innerHTML = `
            <div class="alert alert-warning">
                <h6>⚠️ データ準備中</h6>
                <p>${mountainName}のコースプロファイルデータを準備中です。</p>
                <a href="${mountainName}.html" class="btn btn-outline-primary btn-sm" target="_blank">
                    山の詳細ページで確認 →
                </a>
            </div>
        `;
    } else {
        // チャートコンテナをクリア
        chartContainer.innerHTML = '';
        
        // 統計情報を表示
        const statsDiv = document.createElement('div');
        statsDiv.className = 'mb-3 p-3 bg-light rounded';
        statsDiv.innerHTML = `
            <div class="row text-center">
                <div class="col-3">
                    <strong>${profileData.stats.total_distance}</strong><br>
                    <small class="text-muted">総距離(km)</small>
                </div>
                <div class="col-3">
                    <strong>+${profileData.stats.elevation_gain}</strong><br>
                    <small class="text-muted">獲得標高(m)</small>
                </div>
                <div class="col-3">
                    <strong>${profileData.stats.summit_elevation}</strong><br>
                    <small class="text-muted">標高(m)</small>
                </div>
                <div class="col-3">
                    <strong>${profileData.waypoints ? profileData.waypoints.length : 0}</strong><br>
                    <small class="text-muted">地点数</small>
                </div>
            </div>
        `;
        chartContainer.appendChild(statsDiv);
        
        // Chart.jsが利用可能かチェック
        if (typeof Chart === 'undefined') {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.innerHTML = `
                <h6>❌ Chart.jsが読み込まれていません</h6>
                <p>コースプロファイルの表示にはChart.jsライブラリが必要です。</p>
            `;
            chartContainer.appendChild(errorDiv);
        } else {
            // Chart.js用のキャンバス作成
            const canvas = document.createElement('canvas');
            canvas.id = 'profile-chart-canvas';
            canvas.style.height = '300px';
            chartContainer.appendChild(canvas);
            
            // Chart.jsでグラフを作成
            const ctx = canvas.getContext('2d');
            
            const chartConfig = {
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
                                    const distance = context.parsed.x;
                                    const waypoint = profileData.waypoints?.find(wp => 
                                        Math.abs(wp.distance - distance) < 0.2
                                    );
                                    if (waypoint) {
                                        return [`地点: ${waypoint.name}`, `時刻: ${waypoint.time}`];
                                    }
                                    return '';
                                }
                            }
                        }
                    }
                }
            };
            
            // チャートを作成
            const chart = new Chart(ctx, chartConfig);
            
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
        }
        
        // 主要地点リストを表示
        if (profileData.waypoints) {
            const waypointsDiv = document.createElement('div');
            waypointsDiv.className = 'mt-3';
            waypointsDiv.innerHTML = `
                <h6>📍 主要地点</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>地点名</th>
                                <th>距離</th>
                                <th>標高</th>
                                <th>時刻目安</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${profileData.waypoints.map(wp => `
                                <tr>
                                    <td>${wp.name}</td>
                                    <td>${wp.distance}km</td>
                                    <td>${wp.elevation}m</td>
                                    <td>${wp.time}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            chartContainer.appendChild(waypointsDiv);
        }
    }
    
    // モーダルを表示
    try {
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        console.log('✅ モーダル表示成功:', mountainName);
    } catch (error) {
        console.error('❌ モーダル表示エラー:', error);
    }
    
    // イベントの完全停止を確認
    return false;
}

// カードナビゲーション機能（イベント制御付き）
function navigateToMountain(mountainName, event) {
    // プロファイルボタンからのイベントかチェック
    if (event && event.target) {
        const target = event.target;
        const isProfileButton = target.closest('button[data-bs-target="#courseProfileModal"]');
        
        // プロファイルボタンの場合は遷移しない
        if (isProfileButton) {
            console.log('🔘 プロファイルボタンクリック - 遷移キャンセル');
            return false;
        }
    }
    
    console.log('🔄 カードクリック - 詳細画面へ遷移:', mountainName);
    
    // 詳細画面に遷移
    window.location.href = `${mountainName}.html`;
    return false;
}

// showCourseProfile 関数を修正（イベント制御強化）
function showCourseProfile(mountainName, event) {
    // イベントバブリングを完全に停止
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    
    console.log('📊 プロファイルボタンクリック:', mountainName);
    
    const modal = document.getElementById('courseProfileModal');
    const modalTitle = document.getElementById('courseProfileModalLabel');
    const chartContainer = document.getElementById('modal-chart-container');
    
    if (!modal || !modalTitle || !chartContainer) {
        console.error('❌ モーダル要素が見つかりません');
        return false;
    }
    
    // モーダルタイトル更新
    modalTitle.textContent = `${mountainName} - コースプロファイル`;
    
    // プロファイルデータを取得
    const profileData = ALL_COURSE_PROFILE_DATA[mountainName];
    
    if (!profileData) {
        console.warn('⚠️ プロファイルデータが見つかりません:', mountainName);
        chartContainer.innerHTML = `
            <div class="alert alert-warning">
                <h6>⚠️ データ準備中</h6>
                <p>${mountainName}のコースプロファイルデータを準備中です。</p>
                <a href="${mountainName}.html" class="btn btn-outline-primary btn-sm" target="_blank">
                    山の詳細ページで確認 →
                </a>
            </div>
        `;
    } else {
        // チャートコンテナをクリア
        chartContainer.innerHTML = '';
        
        // 統計情報を表示
        const statsDiv = document.createElement('div');
        statsDiv.className = 'mb-3 p-3 bg-light rounded';
        statsDiv.innerHTML = `
            <div class="row text-center">
                <div class="col-3">
                    <strong>${profileData.stats.total_distance}</strong><br>
                    <small class="text-muted">総距離(km)</small>
                </div>
                <div class="col-3">
                    <strong>+${profileData.stats.elevation_gain}</strong><br>
                    <small class="text-muted">獲得標高(m)</small>
                </div>
                <div class="col-3">
                    <strong>${profileData.stats.summit_elevation}</strong><br>
                    <small class="text-muted">標高(m)</small>
                </div>
                <div class="col-3">
                    <strong>${profileData.waypoints ? profileData.waypoints.length : 0}</strong><br>
                    <small class="text-muted">地点数</small>
                </div>
            </div>
        `;
        chartContainer.appendChild(statsDiv);
        
        // Chart.jsが利用可能かチェック
        if (typeof Chart === 'undefined') {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.innerHTML = `
                <h6>❌ Chart.jsが読み込まれていません</h6>
                <p>コースプロファイルの表示にはChart.jsライブラリが必要です。</p>
            `;
            chartContainer.appendChild(errorDiv);
        } else {
            // Chart.js用のキャンバス作成
            const canvas = document.createElement('canvas');
            canvas.id = 'profile-chart-canvas';
            canvas.style.height = '300px';
            chartContainer.appendChild(canvas);
            
            // Chart.jsでグラフを作成
            const ctx = canvas.getContext('2d');
            
            const chartConfig = {
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
                                    const distance = context.parsed.x;
                                    const waypoint = profileData.waypoints?.find(wp => 
                                        Math.abs(wp.distance - distance) < 0.2
                                    );
                                    if (waypoint) {
                                        return [`地点: ${waypoint.name}`, `時刻: ${waypoint.time}`];
                                    }
                                    return '';
                                }
                            }
                        }
                    }
                }
            };
            
            // チャートを作成
            const chart = new Chart(ctx, chartConfig);
            
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
        }
        
        // 主要地点リストを表示
        if (profileData.waypoints) {
            const waypointsDiv = document.createElement('div');
            waypointsDiv.className = 'mt-3';
            waypointsDiv.innerHTML = `
                <h6>📍 主要地点</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>地点名</th>
                                <th>距離</th>
                                <th>標高</th>
                                <th>時刻目安</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${profileData.waypoints.map(wp => `
                                <tr>
                                    <td>${wp.name}</td>
                                    <td>${wp.distance}km</td>
                                    <td>${wp.elevation}m</td>
                                    <td>${wp.time}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            chartContainer.appendChild(waypointsDiv);
        }
    }
    
    // モーダルを表示
    try {
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        console.log('✅ モーダル表示成功:', mountainName);
    } catch (error) {
        console.error('❌ モーダル表示エラー:', error);
    }
    
    // イベントの完全停止
    return false;
}
