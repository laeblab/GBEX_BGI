import {FC, useState} from 'react';
import {TabView, TabPanel} from 'primereact/tabview';
import {Editor, EditorTextChangeEvent} from 'primereact/editor';
import './App.css'

export const App: FC = () => {
    const [text, setText] = useState<string>('');
    const scrollableTabs = Array.from({length: 50}, (_, i) => ({
        title: `Tab ${i + 1}`,
        content: `Tab ${i + 1} Content`
    }))

    return (
        <div id={"eln"}>
            <div id={"sidebar"}>

            </div>
            <div id={"right"}>
                <TabView scrollable style={{ height: '100%' }}>
                    {scrollableTabs.map((tab) => {
                        return (
                            <TabPanel key={tab.title} header={tab.title} closable style={{ height: '100%' }}>
                                <Editor style={{ height: '100%' }} value={text} onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue!)}/>
                            </TabPanel>
                        );
                    })}
                </TabView>
            </div>
        </div>
    )
};