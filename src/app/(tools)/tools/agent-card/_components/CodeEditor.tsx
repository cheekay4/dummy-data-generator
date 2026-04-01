'use client';

import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const darkTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1C1C1C',
    color: '#FAFAF5',
  },
  '.cm-gutters': {
    backgroundColor: '#1C1C1C',
    borderRight: '1px solid #2A2A2C',
    color: '#555555',
  },
  '.cm-activeLine': {
    backgroundColor: '#2A2A2C44',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2A2A2C',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#C0392B',
  },
  '.cm-selectionBackground': {
    backgroundColor: '#C0392B22',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: '#C0392B33',
  },
});

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps): JSX.Element {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[json(), darkTheme]}
      readOnly={readOnly}
      height="400px"
      className="rounded-[4px] overflow-hidden border border-sumi-light"
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        bracketMatching: true,
        closeBrackets: true,
      }}
    />
  );
}
