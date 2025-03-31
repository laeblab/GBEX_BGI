import {FC, useState} from 'react';

import {Editor, EditorTextChangeEvent} from 'primereact/editor';

import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
//import 'primeicons/primeicons.css';

export const App: FC = () => {
    const [text, setText] = useState<string>('');

    return (
        <div className="card">
            <Editor value={text} onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue!)} style={{ height: '320px' }} />
        </div>
    )
};
