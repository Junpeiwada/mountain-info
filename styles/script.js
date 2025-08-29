// 日本アルプス登山情報サイト JavaScript

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeFilters();
    initializeTooltips();
    initializeImageGallery();
    initializeCourseProfiles();
    
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

// カードに画像ギャラリーを追加
function addImageGalleryToCard(card, mountainName) {
    const cardBody = card.querySelector('.card-body');
    if (!cardBody) return;
    
    // 画像表示エリアを作成
    const imageContainer = document.createElement('div');
    imageContainer.className = 'mountain-images mb-3';
    imageContainer.style.display = 'none'; // 初期は非表示
    
    // ボタングループを作成
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'mt-2 d-flex gap-1';
    
    // 画像切り替えボタンを作成
    const toggleButton = document.createElement('button');
    toggleButton.className = 'btn btn-outline-info btn-sm';
    toggleButton.textContent = '🔍 写真を検索';
    toggleButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMountainImages(mountainName, imageContainer, toggleButton);
    };
    
    // ボタンをグループに追加
    buttonGroup.appendChild(toggleButton);
    
    // カードボディにボタングループと画像エリアを追加
    cardBody.appendChild(buttonGroup);
    cardBody.appendChild(imageContainer);
}

// 山の画像表示を切り替え
function toggleMountainImages(mountainName, container, button) {
    if (container.style.display === 'none') {
        loadMountainImages(mountainName, container);
        container.style.display = 'block';
        button.textContent = '🔍 検索を隠す';
    } else {
        container.style.display = 'none';
        button.textContent = '🔍 写真を検索';
    }
}

// Google画像検索結果を小さく埋め込み表示
function loadMountainImages(mountainName, container) {
    container.innerHTML = '<div class="text-center"><small>検索結果を読み込み中...</small></div>';
    
    // Google画像検索のクエリを作成
    const searchQuery = `${mountainName} 登山 山頂 風景`;
    
    // 小さな埋め込み画像検索結果を表示
    displayMiniImageSearch(container, searchQuery, mountainName);
}

// 小さな画像検索結果を表示
function displayMiniImageSearch(container, searchQuery, mountainName) {
    // Google画像検索の埋め込みURL
    const googleSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;
    
    const searchHTML = `
        <div class="mini-image-search border rounded bg-light mt-2">
            <div class="p-2 bg-info text-white d-flex justify-content-between align-items-center">
                <div>
                    <small class="fw-bold">🔍 ${mountainName} の写真</small>
                </div>
                <a href="${googleSearchUrl}" target="_blank" class="btn btn-light btn-sm" 
                   onclick="event.stopPropagation();">
                    <small>📱 もっと見る</small>
                </a>
            </div>
            
            <!-- Google画像検索プレビュー表示 -->
            <div class="p-2">
                <div class="row g-1 mb-2">
                    ${Array.from({length: 4}, (_, i) => `
                        <div class="col-3">
                            <div class="placeholder-img bg-light border rounded d-flex align-items-center justify-content-center" 
                                 style="height: 50px; cursor: pointer; position: relative; overflow: hidden;"
                                 onclick="event.stopPropagation(); openGoogleImageSearch('${searchQuery}');"
                                 onmouseover="this.style.backgroundColor='#e9ecef'"
                                 onmouseout="this.style.backgroundColor='#f8f9fa'">
                                <div class="text-center">
                                    <small style="font-size: 0.7rem;">🏔️</small><br>
                                    <tiny style="font-size: 0.6rem; color: #666;">画像${i + 1}</tiny>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="text-center">
                    <button class="btn btn-outline-primary btn-sm" 
                            onclick="event.stopPropagation(); openGoogleImageSearch('${searchQuery}');">
                        🔗 Google で ${mountainName} の写真を見る
                    </button>
                    <div class="mt-1">
                        <small class="text-muted">※ Google画像検索で実際の写真をご覧いただけます</small>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = searchHTML;
}

// Google画像検索を新しいタブで開く
function openGoogleImageSearch(searchQuery) {
    const googleSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;
    window.open(googleSearchUrl, '_blank');
}

// コースプロファイル機能の初期化
function initializeCourseProfiles() {
    // Chart.jsライブラリの動的読み込み
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            console.log('📊 Chart.js ライブラリ読み込み完了');
            setupProfileButtons();
        };
        document.head.appendChild(script);
    } else {
        setupProfileButtons();
    }
}

// プロファイル表示ボタンをセットアップ
function setupProfileButtons() {
    const mountainCards = document.querySelectorAll('.mountain-card');
    
    mountainCards.forEach(card => {
        const mountainName = card.dataset.name;
        addProfileButtonToCard(card, mountainName);
    });
}

// カードにプロファイルボタンを追加
function addProfileButtonToCard(card, mountainName) {
    const cardBody = card.querySelector('.card-body');
    if (!cardBody) return;
    
    // 既存のボタングループを探す（写真検索ボタンがある場合）
    let buttonGroup = cardBody.querySelector('.mt-2.d-flex.gap-1');
    
    // ボタングループがない場合は作成
    if (!buttonGroup) {
        buttonGroup = document.createElement('div');
        buttonGroup.className = 'mt-2 d-flex gap-1';
        cardBody.appendChild(buttonGroup);
    }
    
    // プロファイル表示ボタンを作成
    const profileButton = document.createElement('button');
    profileButton.className = 'btn btn-outline-secondary btn-sm';
    profileButton.textContent = '📊 コース';
    profileButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showCourseProfile(mountainName);
    };
    
    // ボタンをグループに追加
    buttonGroup.appendChild(profileButton);
}

// コースプロファイルを表示
function showCourseProfile(mountainName) {
    // プロファイルデータの候補パス
    const profilePath = `profiles/${mountainName}/chart_data.json`;
    
    fetch(profilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`プロファイルデータが見つかりません: ${mountainName}`);
            }
            return response.json();
        })
        .then(data => {
            displayProfileModal(mountainName, data);
        })
        .catch(error => {
            console.log(`📊 ${mountainName} のプロファイルデータがありません`);
            showProfilePlaceholder(mountainName);
        });
}

// プロファイルモーダルを表示
function displayProfileModal(mountainName, chartData) {
    let modal = document.getElementById('profileModal');
    if (!modal) {
        modal = createProfileModal();
        document.body.appendChild(modal);
    }
    
    // モーダルタイトルを更新
    modal.querySelector('#profileModalTitle').textContent = `${mountainName} コースプロファイル`;
    
    // チャートを描画
    const ctx = modal.querySelector('#profileChart').getContext('2d');
    
    // 既存のチャートを破棄
    if (window.currentProfileChart) {
        window.currentProfileChart.destroy();
    }
    
    // 新しいチャートを作成
    window.currentProfileChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `${mountainName} 標高プロファイル`
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '距離 (km)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '標高 (m)'
                    }
                }
            }
        }
    });
    
    // モーダルを表示
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// プロファイルモーダルを作成
function createProfileModal() {
    const modalHTML = `
        <div class="modal fade" id="profileModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="profileModalTitle">コースプロファイル</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="chart-container" style="height: 400px;">
                            <canvas id="profileChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    return modalElement.firstElementChild;
}

// プロファイルデータがない場合のプレースホルダー表示
function showProfilePlaceholder(mountainName) {
    alert(`${mountainName} のコースプロファイルは準備中です。
近日中に追加予定です。`);
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