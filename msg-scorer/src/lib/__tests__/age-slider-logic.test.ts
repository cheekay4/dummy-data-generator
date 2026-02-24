import { describe, it, expect } from 'vitest';
import {
  calcTotal,
  calcTotalPersonCount,
  updateBySlider,
  updateDirect,
  updateByPersonCount,
  type AgeDist,
} from '../age-slider-logic';

// 合計ちょうど100%の基本データ
const base: AgeDist = {
  under20:     5,
  twenties:   25,
  thirties:   35,
  forties:    20,
  fifties:    10,
  sixtiesPlus: 5,
};

// ─────────────────────────────────────────────────────────────
// calcTotal
// ─────────────────────────────────────────────────────────────
describe('calcTotal', () => {
  it('合計100%を正しく計算する', () => {
    expect(calcTotal(base)).toBe(100);
  });

  it('合計が100%未満の場合も正しく返す', () => {
    const dist: AgeDist = { ...base, sixtiesPlus: 0 };
    expect(calcTotal(dist)).toBe(95);
  });

  it('小数点1桁で返す（浮動小数点誤差を吸収する）', () => {
    const dist: AgeDist = { ...base, under20: 5.1, twenties: 24.9 };
    expect(calcTotal(dist)).toBe(100);
  });
});

// ─────────────────────────────────────────────────────────────
// calcTotalPersonCount
// ─────────────────────────────────────────────────────────────
describe('calcTotalPersonCount', () => {
  it('母数10,000件のとき各年代の人数合計が10,000になる', () => {
    expect(calcTotalPersonCount(base, 10000)).toBe(10000);
  });

  it('母数5,000件のとき合計が5,000になる', () => {
    expect(calcTotalPersonCount(base, 5000)).toBe(5000);
  });
});

// ─────────────────────────────────────────────────────────────
// updateBySlider
// ─────────────────────────────────────────────────────────────
describe('updateBySlider', () => {
  it('増加後も合計が100%のままである', () => {
    const result = updateBySlider(base, 'thirties', 45); // 35→45 (+10)
    expect(calcTotal(result)).toBe(100);
  });

  it('減少後も合計が100%のままである', () => {
    const result = updateBySlider(base, 'thirties', 20); // 35→20 (-15)
    expect(calcTotal(result)).toBe(100);
  });

  it('操作した年代が指定値に変わる', () => {
    const result = updateBySlider(base, 'forties', 30);
    expect(result.forties).toBe(30);
  });

  it('total<100%でも100%を超えるとき超過分だけ他年代から盗む', () => {
    // total=50%、under20=5%→60% (diff=55)
    // newTotal=105% → excess=5%、otherTotal=45% ≥ 5% → proceed して5%だけ盗む
    const sparse: AgeDist = {
      under20: 5, twenties: 20, thirties: 15,
      forties: 10, fifties: 0, sixtiesPlus: 0,
    };
    const result = updateBySlider(sparse, 'under20', 60);
    expect(result.under20).toBe(60);
    expect(calcTotal(result)).toBe(100); // 超過分だけ盗んで100%に収める
  });

  it('変化量が0のとき同じ参照を返す', () => {
    const result = updateBySlider(base, 'twenties', 25);
    expect(result).toBe(base);
  });

  it('連動先が全て0のときは増加をブロックする', () => {
    const allZeroOthers: AgeDist = {
      under20: 100, twenties: 0, thirties: 0,
      forties: 0, fifties: 0, sixtiesPlus: 0,
    };
    // under20を100から増やそうとしても他が全部0なのでブロック
    const result = updateBySlider(allZeroOthers, 'under20', 100);
    expect(result).toBe(allZeroOthers);
  });
});

// ─────────────────────────────────────────────────────────────
// updateDirect
// ─────────────────────────────────────────────────────────────
describe('updateDirect', () => {
  it('指定した年代だけが変わる', () => {
    const result = updateDirect(base, 'forties', 40);
    expect(result.forties).toBe(40);
    // 他年代は一切変わらない
    expect(result.under20).toBe(base.under20);
    expect(result.twenties).toBe(base.twenties);
    expect(result.thirties).toBe(base.thirties);
    expect(result.fifties).toBe(base.fifties);
    expect(result.sixtiesPlus).toBe(base.sixtiesPlus);
  });

  it('合計が100%を超えてもブロックしない（バリデーションは呼び出し元の責務）', () => {
    const result = updateDirect(base, 'thirties', 80); // 35→80 → 合計145%
    expect(calcTotal(result)).toBeGreaterThan(100);
    expect(result.thirties).toBe(80);
  });

  it('0%に設定できる', () => {
    const result = updateDirect(base, 'under20', 0);
    expect(result.under20).toBe(0);
  });

  it('小数点1桁に丸める', () => {
    const result = updateDirect(base, 'twenties', 33.333);
    expect(result.twenties).toBe(33.3);
  });
});

// ─────────────────────────────────────────────────────────────
// updateByPersonCount
// ─────────────────────────────────────────────────────────────
describe('updateByPersonCount', () => {
  it('人数を%に正しく変換する（母数10,000件、2,500人→25%）', () => {
    const result = updateByPersonCount(base, 'twenties', 2500, 10000);
    expect(result.twenties).toBe(25);
  });

  it('人数を%に変換する（母数10,000件、3,333人→33.3%）', () => {
    const result = updateByPersonCount(base, 'thirties', 3333, 10000);
    expect(result.thirties).toBe(33.3);
  });

  it('他年代は変更しない', () => {
    const result = updateByPersonCount(base, 'forties', 1000, 10000);
    expect(result.thirties).toBe(base.thirties);
    expect(result.under20).toBe(base.under20);
  });

  it('totalRecipients が 0 のとき元の dist を返す', () => {
    const result = updateByPersonCount(base, 'forties', 1000, 0);
    expect(result).toBe(base);
  });

  it('0人を入力すると0%になる', () => {
    const result = updateByPersonCount(base, 'under20', 0, 10000);
    expect(result.under20).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────
// 境界値・複合ケース
// ─────────────────────────────────────────────────────────────
describe('境界値・複合ケース', () => {
  it('スライダーを0に下げても合計100%を維持する', () => {
    const result = updateBySlider(base, 'under20', 0);
    expect(calcTotal(result)).toBe(100);
    expect(result.under20).toBe(0);
  });

  it('スライダーは合計を100%にリセットせず「現在の合計」を維持する', () => {
    // 直接入力でthirtiesを50%に→合計は115%
    const afterDirect = updateDirect(base, 'thirties', 50);
    expect(calcTotal(afterDirect)).toBe(115);

    // スライダーでthirtiesを30%に変更 (diff=-20)
    const afterSlider = updateBySlider(afterDirect, 'thirties', 30);
    // 合計は115%のまま維持される（100%にはリセットされない）
    expect(calcTotal(afterSlider)).toBe(115);
    expect(afterSlider.thirties).toBe(30);
  });

  it('全年代が0のdistでも自由にスライダーを設定できる（100%以内なので盗む必要なし）', () => {
    const allZero: AgeDist = {
      under20: 0, twenties: 0, thirties: 0,
      forties: 0, fifties: 0, sixtiesPlus: 0,
    };
    const result = updateBySlider(allZero, 'twenties', 50);
    // newTotal=50% ≤ 100% → 自由に設定
    expect(result.twenties).toBe(50);
    expect(calcTotal(result)).toBe(50);
  });
});

// ─────────────────────────────────────────────────────────────
// スライダー意地悪パターン（バグ修正後の動作確認）
// ─────────────────────────────────────────────────────────────
describe('スライダー意地悪パターン5件', () => {
  // パターン1: 最大値設定→減少後に他年代が自由設定できる（報告されたバグの再現）
  it('P1: under20=60%に減らした後、他年代をスライダーで自由設定できる', () => {
    // totalRecipients=15000 想定。under20=100%→60%（9000人）に変更済みの状態
    const afterReduction: AgeDist = {
      under20: 60, twenties: 0, thirties: 0,
      forties: 0, fifties: 0, sixtiesPlus: 0,
    };
    // twenties を 30% に設定（4500人）
    const step1 = updateBySlider(afterReduction, 'twenties', 30);
    expect(step1.twenties).toBe(30);
    expect(step1.under20).toBe(60); // under20 は変わらない
    expect(calcTotal(step1)).toBe(90);

    // thirties を 5% に設定（750人）
    const step2 = updateBySlider(step1, 'thirties', 5);
    expect(step2.thirties).toBe(5);
    expect(step2.under20).toBe(60); // under20 は変わらない
    expect(step2.twenties).toBe(30); // twenties も変わらない
    expect(calcTotal(step2)).toBe(95);
  });

  // パターン2: total<100% でスライダーを100%超えまで増やすと超過分だけ盗む
  it('P2: total=60%のとき80%まで増やすと超過40%をunder20から盗む', () => {
    const partial: AgeDist = {
      under20: 60, twenties: 0, thirties: 0,
      forties: 0, fifties: 0, sixtiesPlus: 0,
    };
    const result = updateBySlider(partial, 'twenties', 80); // newTotal=140%, excess=40%
    expect(result.twenties).toBe(80);
    expect(result.under20).toBe(20); // 60-40=20
    expect(calcTotal(result)).toBe(100);
  });

  // パターン3: total<100% のとき減少で合計が下がる（100%に戻らない・補填しない）
  it('P3: total=90%のとき減少しても他年代が勝手に増えない', () => {
    const partial: AgeDist = {
      under20: 60, twenties: 30, thirties: 0,
      forties: 0, fifties: 0, sixtiesPlus: 0,
    }; // total=90%
    const result = updateBySlider(partial, 'twenties', 10); // 30→10, diff=-20
    expect(result.twenties).toBe(10);
    expect(result.under20).toBe(60); // 変わらない
    expect(calcTotal(result)).toBe(70); // 90-20=70（補填なし）
  });

  // パターン4: total=100%からひとつを0にしても合計100%を維持する（連動確認）
  it('P4: total=100%でunder20を0にすると他年代に5%分配して100%維持', () => {
    const result = updateBySlider(base, 'under20', 0); // 5→0, diff=-5
    expect(result.under20).toBe(0);
    expect(calcTotal(result)).toBe(100); // 5%が他年代に分配される
  });

  // パターン5: 複数回スライダー操作でも合計が100%を絶対に超えない
  it('P5: total=100%で複数回スライダー操作しても合計は常に100%', () => {
    let dist = base;
    dist = updateBySlider(dist, 'thirties', 50) as AgeDist; // +15, steal from others
    expect(calcTotal(dist)).toBe(100);
    dist = updateBySlider(dist, 'twenties', 35) as AgeDist; // twenties変更
    expect(calcTotal(dist)).toBe(100);
    dist = updateBySlider(dist, 'forties', 5) as AgeDist;  // forties変更
    expect(calcTotal(dist)).toBe(100);
  });
});
