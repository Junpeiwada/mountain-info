#!/usr/bin/env python3
"""
登山コースプロファイル（標高グラフ）生成スクリプト

機能:
- 主要地点データから標高プロファイルを生成
- Chart.js用JSONデータ出力
- 静的SVGグラフ作成
- HTMLページ用のプロファイル情報生成
"""

import json
import os
import math
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from pathlib import Path
from typing import Dict, List, Any

# 日本語フォント設定
plt.rcParams['font.family'] = ['DejaVu Sans']

class CourseProfileGenerator:
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir)
        self.profiles_dir = self.base_dir / "共通資源" / "profiles"
        
        # 山ごとのプロファイルデータ
        self.mountain_data = {
            "奥穂高岳": {
                "mountain": "奥穂高岳",
                "route": "上高地〜涸沢経由",
                "total_distance": 10.5,
                "total_elevation_gain": 1580,
                "waypoints": [
                    {"name": "上高地BT", "distance": 0.0, "elevation": 1510, "time": "06:00"},
                    {"name": "明神池", "distance": 2.1, "elevation": 1530, "time": "07:30"},
                    {"name": "徳沢ロッヂ", "distance": 3.4, "elevation": 1560, "time": "08:30"},
                    {"name": "横尾山荘", "distance": 5.4, "elevation": 1620, "time": "09:30"},
                    {"name": "本谷橋", "distance": 6.8, "elevation": 1850, "time": "11:00"},
                    {"name": "涸沢ヒュッテ", "distance": 8.3, "elevation": 2300, "time": "12:00"},
                    {"name": "ザイテングラード", "distance": 9.2, "elevation": 2800, "time": "14:00"},
                    {"name": "奥穂高岳山頂", "distance": 10.5, "elevation": 3190, "time": "15:00"}
                ]
            },
            "槍ヶ岳": {
                "mountain": "槍ヶ岳", 
                "route": "上高地〜槍沢経由",
                "total_distance": 11.0,
                "total_elevation_gain": 1670,
                "waypoints": [
                    {"name": "上高地BT", "distance": 0.0, "elevation": 1510, "time": "06:00"},
                    {"name": "明神池", "distance": 2.1, "elevation": 1530, "time": "07:30"},
                    {"name": "徳沢ロッヂ", "distance": 3.4, "elevation": 1560, "time": "08:30"},
                    {"name": "横尾山荘", "distance": 5.4, "elevation": 1620, "time": "09:30"},
                    {"name": "槍沢ロッヂ", "distance": 7.8, "elevation": 2100, "time": "12:00"},
                    {"name": "大曲", "distance": 8.5, "elevation": 2050, "time": "13:00"},
                    {"name": "槍ヶ岳山荘", "distance": 10.2, "elevation": 3020, "time": "15:30"},
                    {"name": "槍ヶ岳山頂", "distance": 11.0, "elevation": 3180, "time": "16:30"}
                ]
            },
            "立山": {
                "mountain": "立山（雄山）",
                "route": "室堂〜一ノ越経由", 
                "total_distance": 2.4,
                "total_elevation_gain": 583,
                "waypoints": [
                    {"name": "室堂ターミナル", "distance": 0.0, "elevation": 2450, "time": "08:00"},
                    {"name": "みくりが池", "distance": 0.8, "elevation": 2405, "time": "08:15"},
                    {"name": "一ノ越", "distance": 1.5, "elevation": 2700, "time": "09:00"},
                    {"name": "雄山神社", "distance": 2.2, "elevation": 2992, "time": "09:40"},
                    {"name": "雄山山頂", "distance": 2.4, "elevation": 3003, "time": "10:00"}
                ]
            },
            "木曽駒ヶ岳": {
                "mountain": "木曽駒ヶ岳",
                "route": "千畳敷経由",
                "total_distance": 2.5,
                "total_elevation_gain": 344, 
                "waypoints": [
                    {"name": "千畳敷駅", "distance": 0.0, "elevation": 2612, "time": "08:00"},
                    {"name": "八丁坂取付", "distance": 0.3, "elevation": 2650, "time": "08:15"},
                    {"name": "乗越浄土", "distance": 1.2, "elevation": 2850, "time": "09:30"},
                    {"name": "中岳", "distance": 1.8, "elevation": 2925, "time": "10:00"},
                    {"name": "木曽駒ヶ岳山頂", "distance": 2.5, "elevation": 2956, "time": "10:30"}
                ]
            },
            "北岳": {
                "mountain": "北岳",
                "route": "広河原〜白根御池経由",
                "total_distance": 7.5,
                "total_elevation_gain": 1700,
                "waypoints": [
                    {"name": "広河原", "distance": 0.0, "elevation": 1520, "time": "06:00"},
                    {"name": "白根御池小屋分岐", "distance": 2.8, "elevation": 1950, "time": "08:30"},
                    {"name": "白根御池小屋", "distance": 3.5, "elevation": 2230, "time": "10:00"},
                    {"name": "草すべり", "distance": 5.0, "elevation": 2500, "time": "12:00"},
                    {"name": "小太郎尾根分岐", "distance": 6.2, "elevation": 2900, "time": "13:30"},
                    {"name": "肩の小屋", "distance": 6.8, "elevation": 2983, "time": "14:00"},
                    {"name": "北岳山頂", "distance": 7.5, "elevation": 3193, "time": "14:30"}
                ]
            },
            "西穂高岳": {
                "mountain": "西穂高岳",
                "route": "新穂高ロープウェイ経由",
                "total_distance": 4.0,
                "total_elevation_gain": 753,
                "waypoints": [
                    {"name": "西穂高口駅", "distance": 0.0, "elevation": 2156, "time": "08:30"},
                    {"name": "西穂山荘", "distance": 1.2, "elevation": 2400, "time": "09:40"},
                    {"name": "西穂丸山", "distance": 1.7, "elevation": 2500, "time": "10:20"},
                    {"name": "西穂独標", "distance": 2.7, "elevation": 2701, "time": "11:30"},
                    {"name": "ピラミッドピーク", "distance": 3.5, "elevation": 2851, "time": "12:30"},
                    {"name": "西穂高岳山頂", "distance": 4.0, "elevation": 2909, "time": "13:00"}
                ]
            }
        }
    
    def interpolate_elevation(self, waypoints: List[Dict]) -> List[Dict]:
        """主要地点間の標高を線形補完して滑らかなカーブを作成"""
        interpolated_points = []
        
        for i in range(len(waypoints) - 1):
            start = waypoints[i]
            end = waypoints[i + 1]
            
            # 距離に基づく補完ポイント数を計算（100m間隔基準）
            distance_diff = end["distance"] - start["distance"]
            points_count = max(int(distance_diff * 10), 2)  # 最低2点
            
            for j in range(points_count):
                ratio = j / (points_count - 1)
                
                # スプライン補完風の効果を追加
                if j > 0 and j < points_count - 1:
                    # 中間点では少しカーブをつける
                    curve_factor = math.sin(ratio * math.pi) * 0.1
                    elevation_diff = end["elevation"] - start["elevation"]
                    curved_elevation = start["elevation"] + (elevation_diff * ratio) + (elevation_diff * curve_factor)
                else:
                    curved_elevation = start["elevation"] + (end["elevation"] - start["elevation"]) * ratio
                
                interpolated_point = {
                    "distance": start["distance"] + (distance_diff * ratio),
                    "elevation": curved_elevation
                }
                interpolated_points.append(interpolated_point)
        
        return interpolated_points
    
    def calculate_gradient_stats(self, waypoints: List[Dict]) -> Dict:
        """勾配統計情報を計算"""
        gradients = []
        sections = []
        
        for i in range(len(waypoints) - 1):
            start = waypoints[i]
            end = waypoints[i + 1]
            
            distance_diff = (end["distance"] - start["distance"]) * 1000  # メートル変換
            elevation_diff = end["elevation"] - start["elevation"]
            
            if distance_diff > 0:
                gradient = (elevation_diff / distance_diff) * 100  # パーセント
                gradients.append(gradient)
                
                sections.append({
                    "section": f"{start['name']}→{end['name']}",
                    "distance": end["distance"] - start["distance"],
                    "elevation_diff": elevation_diff,
                    "gradient": gradient
                })
        
        return {
            "average_gradient": sum(gradients) / len(gradients) if gradients else 0,
            "max_gradient": max(gradients) if gradients else 0,
            "min_gradient": min(gradients) if gradients else 0,
            "sections": sections
        }
    
    def create_svg_profile(self, mountain_name: str, data: Dict) -> str:
        """静的SVGグラフを作成"""
        waypoints = data["waypoints"]
        interpolated = self.interpolate_elevation(waypoints)
        
        # グラフデータ準備
        distances = [point["distance"] for point in interpolated]
        elevations = [point["elevation"] for point in interpolated]
        
        # Matplotlibでグラフ作成
        plt.figure(figsize=(12, 6))
        
        # メインプロファイル線
        plt.fill_between(distances, elevations, alpha=0.3, color='#2c5aa0', label='標高プロファイル')
        plt.plot(distances, elevations, color='#2c5aa0', linewidth=2)
        
        # 主要地点マーカー
        waypoint_distances = [wp["distance"] for wp in waypoints]
        waypoint_elevations = [wp["elevation"] for wp in waypoints]
        waypoint_names = [wp["name"] for wp in waypoints]
        
        plt.scatter(waypoint_distances, waypoint_elevations, color='red', s=50, zorder=5)
        
        # 主要地点ラベル
        for i, (x, y, name) in enumerate(zip(waypoint_distances, waypoint_elevations, waypoint_names)):
            plt.annotate(name, (x, y), xytext=(0, 10), textcoords='offset points', 
                        ha='center', fontsize=8, rotation=0)
        
        # グラフ設定
        plt.xlabel('Distance (km)', fontsize=12)
        plt.ylabel('Elevation (m)', fontsize=12)
        plt.title(f'{mountain_name} - Course Profile ({data["route"]})', fontsize=14, fontweight='bold')
        plt.grid(True, alpha=0.3)
        plt.legend()
        
        # 統計情報をテキストで追加
        stats_text = f'Total Distance: {data["total_distance"]}km\\nElevation Gain: {data["total_elevation_gain"]}m'
        plt.text(0.02, 0.98, stats_text, transform=plt.gca().transAxes, fontsize=10,
                verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
        
        plt.tight_layout()
        
        # SVG保存
        svg_path = self.profiles_dir / mountain_name / "profile.svg"
        plt.savefig(svg_path, format='svg', dpi=300, bbox_inches='tight')
        plt.close()
        
        return str(svg_path)
    
    def generate_chart_js_data(self, data: Dict) -> Dict:
        """Chart.js用のデータ形式を生成"""
        interpolated = self.interpolate_elevation(data["waypoints"])
        
        chart_data = {
            "labels": [f"{point['distance']:.1f}" for point in interpolated],
            "datasets": [{
                "label": f"{data['mountain']} 標高プロファイル",
                "data": [{"x": point["distance"], "y": point["elevation"]} for point in interpolated],
                "borderColor": "#2c5aa0",
                "backgroundColor": "rgba(44, 90, 160, 0.1)",
                "fill": True,
                "tension": 0.3,
                "pointRadius": 0,
                "pointHoverRadius": 6
            }],
            "waypoints": data["waypoints"]  # 主要地点情報
        }
        
        return chart_data
    
    def generate_profile_for_mountain(self, mountain_name: str):
        """特定の山のプロファイルを生成"""
        if mountain_name not in self.mountain_data:
            print(f"❌ {mountain_name} のデータが見つかりません")
            return
        
        data = self.mountain_data[mountain_name]
        mountain_dir = self.profiles_dir / mountain_name
        mountain_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"📊 {mountain_name} のプロファイル生成中...")
        
        # 1. 基本データJSON保存
        profile_data_path = mountain_dir / "profile_data.json"
        with open(profile_data_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # 2. 補完データ生成・保存
        interpolated = self.interpolate_elevation(data["waypoints"])
        interpolated_path = mountain_dir / "interpolated_data.json"
        with open(interpolated_path, 'w', encoding='utf-8') as f:
            json.dump(interpolated, f, ensure_ascii=False, indent=2)
        
        # 3. Chart.jsデータ生成・保存
        chart_data = self.generate_chart_js_data(data)
        chart_data_path = mountain_dir / "chart_data.json"
        with open(chart_data_path, 'w', encoding='utf-8') as f:
            json.dump(chart_data, f, ensure_ascii=False, indent=2)
        
        # 4. 勾配統計計算・保存
        gradient_stats = self.calculate_gradient_stats(data["waypoints"])
        stats_path = mountain_dir / "gradient_stats.json"
        with open(stats_path, 'w', encoding='utf-8') as f:
            json.dump(gradient_stats, f, ensure_ascii=False, indent=2)
        
        # 5. SVGグラフ作成
        svg_path = self.create_svg_profile(mountain_name, data)
        
        print(f"   ✅ JSON データ: {profile_data_path}")
        print(f"   ✅ Chart.js データ: {chart_data_path}")
        print(f"   ✅ SVG グラフ: {svg_path}")
        print(f"   ✅ 勾配統計: {stats_path}")
    
    def generate_all_profiles(self):
        """全山のプロファイルを生成"""
        print("🏔️ 全山のコースプロファイル生成を開始...")
        
        for mountain_name in self.mountain_data.keys():
            self.generate_profile_for_mountain(mountain_name)
            print()
        
        print("✅ 全山のコースプロファイル生成完了!")
    
    def generate_markdown_section(self, mountain_name: str) -> str:
        """MDファイル用のプロファイルセクションを生成"""
        if mountain_name not in self.mountain_data:
            return ""
        
        data = self.mountain_data[mountain_name]
        stats_file = self.profiles_dir / mountain_name / "gradient_stats.json"
        
        if stats_file.exists():
            with open(stats_file, 'r', encoding='utf-8') as f:
                stats = json.load(f)
        else:
            stats = self.calculate_gradient_stats(data["waypoints"])
        
        markdown = f"""
## コースプロファイル（標高グラフ）

### 標高変化の概要
- **総距離**: {data['total_distance']}km
- **獲得標高**: +{data['total_elevation_gain']}m
- **平均勾配**: {stats['average_gradient']:.1f}%
- **最大勾配**: {stats['max_gradient']:.1f}%

<div id="elevation-profile-chart" class="mt-4" style="height: 400px;">
    <!-- Chart.jsグラフがここに表示される -->
</div>

### 区間別詳細
| 区間 | 距離 | 標高差 | 勾配 | 特徴 |
|------|------|--------|------|------|"""

        for section in stats['sections']:
            distance = section['distance']
            elevation_diff = section['elevation_diff']
            gradient = section['gradient']
            
            # 特徴を勾配に基づいて自動生成
            if gradient < 5:
                feature = "平坦な道"
            elif gradient < 15:
                feature = "緩やかな登り"
            elif gradient < 25:
                feature = "急登"
            else:
                feature = "険しい急登"
            
            markdown += f"\n| {section['section']} | {distance:.1f}km | {elevation_diff:+d}m | {gradient:.1f}% | {feature} |"
        
        return markdown

if __name__ == "__main__":
    generator = CourseProfileGenerator()
    generator.generate_all_profiles()