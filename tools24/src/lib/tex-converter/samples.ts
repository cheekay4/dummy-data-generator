export interface SampleFormula {
  label: string;
  latex: string;
}

export const sampleFormulas: SampleFormula[] = [
  {
    label: "二次方程式の解",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  },
  {
    label: "オイラーの等式",
    latex: "e^{i\\pi} + 1 = 0",
  },
  {
    label: "ガウス積分",
    latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}",
  },
  {
    label: "行列",
    latex:
      "A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}",
  },
  {
    label: "総和",
    latex: "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}",
  },
  {
    label: "偏微分",
    latex:
      "\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u",
  },
];
