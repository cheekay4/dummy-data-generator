"""ブロック崩しゲーム (Breakout) - tkinter版"""

import tkinter as tk
import random

# ゲーム設定
WIDTH = 800
HEIGHT = 600
FPS = 16  # ~60FPS

PADDLE_WIDTH = 100
PADDLE_HEIGHT = 12
PADDLE_Y = HEIGHT - 40
PADDLE_SPEED = 8

BALL_SIZE = 10
BALL_SPEED = 5

BLOCK_ROWS = 5
BLOCK_COLS = 8
BLOCK_WIDTH = WIDTH // BLOCK_COLS - 4
BLOCK_HEIGHT = 22
BLOCK_TOP_OFFSET = 60
BLOCK_PADDING = 4

ROW_COLORS = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#3498db"]
ROW_SCORES = [50, 40, 30, 20, 10]


class BreakoutGame:
    def __init__(self, root):
        self.root = root
        self.root.title("ブロック崩し")
        self.root.resizable(False, False)

        self.canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#1a1a2e")
        self.canvas.pack()

        # 入力状態
        self.keys = set()
        self.mouse_x = WIDTH // 2

        # イベントバインド
        self.root.bind("<KeyPress>", self._key_press)
        self.root.bind("<KeyRelease>", self._key_release)
        self.canvas.bind("<Motion>", self._mouse_move)

        self.reset()
        self.game_loop()

    def reset(self):
        self.canvas.delete("all")
        self.score = 0
        self.running = False
        self.game_over = False
        self.cleared = False

        # パドル
        px = WIDTH // 2 - PADDLE_WIDTH // 2
        self.paddle = self.canvas.create_rectangle(
            px, PADDLE_Y, px + PADDLE_WIDTH, PADDLE_Y + PADDLE_HEIGHT,
            fill="#ecf0f1", outline=""
        )

        # ボール
        bx = WIDTH // 2 - BALL_SIZE // 2
        by = PADDLE_Y - BALL_SIZE - 2
        self.ball = self.canvas.create_oval(
            bx, by, bx + BALL_SIZE, by + BALL_SIZE,
            fill="#ffffff", outline=""
        )
        self.ball_dx = BALL_SPEED * random.choice([-1, 1])
        self.ball_dy = -BALL_SPEED

        # ブロック
        self.blocks = []
        for row in range(BLOCK_ROWS):
            for col in range(BLOCK_COLS):
                x = col * (BLOCK_WIDTH + BLOCK_PADDING) + BLOCK_PADDING + 2
                y = row * (BLOCK_HEIGHT + BLOCK_PADDING) + BLOCK_TOP_OFFSET
                block = self.canvas.create_rectangle(
                    x, y, x + BLOCK_WIDTH, y + BLOCK_HEIGHT,
                    fill=ROW_COLORS[row], outline="#1a1a2e", width=1
                )
                self.blocks.append((block, ROW_SCORES[row]))

        # スコア表示
        self.score_text = self.canvas.create_text(
            WIDTH // 2, 20, text="SCORE: 0",
            fill="#ffffff", font=("Consolas", 16, "bold")
        )

        # 開始メッセージ
        self.message = self.canvas.create_text(
            WIDTH // 2, HEIGHT // 2 + 60,
            text="スペースキーでスタート",
            fill="#aaaaaa", font=("", 14)
        )

    def _key_press(self, e):
        self.keys.add(e.keysym)
        if e.keysym == "space":
            if self.game_over or self.cleared:
                self.reset()
            elif not self.running:
                self.running = True
                self.canvas.delete(self.message)
                self.message = None

    def _key_release(self, e):
        self.keys.discard(e.keysym)

    def _mouse_move(self, e):
        self.mouse_x = e.x

    def move_paddle(self):
        coords = self.canvas.coords(self.paddle)
        cx = (coords[0] + coords[2]) / 2

        # マウス追従 or キーボード
        if "Left" in self.keys:
            dx = -PADDLE_SPEED
        elif "Right" in self.keys:
            dx = PADDLE_SPEED
        else:
            dx = self.mouse_x - cx
            dx = max(-PADDLE_SPEED, min(PADDLE_SPEED, dx))

        # 画面端制限
        new_left = coords[0] + dx
        new_right = coords[2] + dx
        if new_left < 0:
            dx = -coords[0]
        elif new_right > WIDTH:
            dx = WIDTH - coords[2]

        self.canvas.move(self.paddle, dx, 0)

    def move_ball(self):
        self.canvas.move(self.ball, self.ball_dx, self.ball_dy)
        coords = self.canvas.coords(self.ball)
        bx1, by1, bx2, by2 = coords

        # 壁反射（左右）
        if bx1 <= 0:
            self.ball_dx = abs(self.ball_dx)
        elif bx2 >= WIDTH:
            self.ball_dx = -abs(self.ball_dx)

        # 壁反射（上）
        if by1 <= 0:
            self.ball_dy = abs(self.ball_dy)

        # 画面下 → ゲームオーバー
        if by1 >= HEIGHT:
            self.running = False
            self.game_over = True
            self.message = self.canvas.create_text(
                WIDTH // 2, HEIGHT // 2,
                text="GAME OVER",
                fill="#e74c3c", font=("Consolas", 32, "bold")
            )
            self.canvas.create_text(
                WIDTH // 2, HEIGHT // 2 + 50,
                text="スペースキーでリトライ",
                fill="#aaaaaa", font=("", 14)
            )
            return

        # パドル反射
        pc = self.canvas.coords(self.paddle)
        if self.ball_dy > 0 and self._overlap(coords, pc):
            self.ball_dy = -abs(self.ball_dy)
            # パドル上の当たり位置で角度調整
            paddle_cx = (pc[0] + pc[2]) / 2
            ball_cx = (bx1 + bx2) / 2
            offset = (ball_cx - paddle_cx) / (PADDLE_WIDTH / 2)
            self.ball_dx = BALL_SPEED * offset * 1.5
            # 最低限の水平速度を確保
            if abs(self.ball_dx) < 1:
                self.ball_dx = 1 if self.ball_dx >= 0 else -1

        # ブロック衝突
        hit = None
        for block, score in self.blocks:
            bc = self.canvas.coords(block)
            if not bc:
                continue
            if self._overlap(coords, bc):
                hit = (block, score, bc)
                break

        if hit:
            block, score, bc = hit
            self.canvas.delete(block)
            self.blocks = [(b, s) for b, s in self.blocks if b != block]
            self.score += score
            self.canvas.itemconfig(self.score_text, text=f"SCORE: {self.score}")

            # 反射方向を判定
            ball_cx = (bx1 + bx2) / 2
            ball_cy = (by1 + by2) / 2
            block_cx = (bc[0] + bc[2]) / 2
            block_cy = (bc[1] + bc[3]) / 2

            dx = ball_cx - block_cx
            dy = ball_cy - block_cy
            half_w = (bc[2] - bc[0]) / 2 + BALL_SIZE / 2
            half_h = (bc[3] - bc[1]) / 2 + BALL_SIZE / 2

            if abs(dx) / half_w > abs(dy) / half_h:
                self.ball_dx = abs(self.ball_dx) if dx > 0 else -abs(self.ball_dx)
            else:
                self.ball_dy = abs(self.ball_dy) if dy > 0 else -abs(self.ball_dy)

            # 全ブロック破壊チェック
            if not self.blocks:
                self.running = False
                self.cleared = True
                self.message = self.canvas.create_text(
                    WIDTH // 2, HEIGHT // 2,
                    text="CLEAR!",
                    fill="#2ecc71", font=("Consolas", 32, "bold")
                )
                self.canvas.create_text(
                    WIDTH // 2, HEIGHT // 2 + 50,
                    text=f"SCORE: {self.score}　スペースキーでリトライ",
                    fill="#aaaaaa", font=("", 14)
                )

    @staticmethod
    def _overlap(a, b):
        return a[0] < b[2] and a[2] > b[0] and a[1] < b[3] and a[3] > b[1]

    def game_loop(self):
        self.move_paddle()
        if self.running:
            self.move_ball()
        self.root.after(FPS, self.game_loop)


if __name__ == "__main__":
    root = tk.Tk()
    game = BreakoutGame(root)
    root.mainloop()
