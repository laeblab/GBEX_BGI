import {FC, useState} from 'react';
import {TabView, TabPanel} from 'primereact/tabview';
import {Card} from 'primereact/card';
import {Editor, EditorTextChangeEvent} from 'primereact/editor';
import {Tree} from 'primereact/tree';
import {TreeNode} from 'primereact/treenode';
import './App.css'

const tree_data = [
    {
        key: '0',
        label: 'Documents',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-inbox',
        children: [
            {
                key: '0-0',
                label: 'Work',
                data: 'Work Folder',
                icon: 'pi pi-fw pi-cog',
                children: [
                    {key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document'},
                    {key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document'}
                ]
            },
            {
                key: '0-1',
                label: 'Home',
                data: 'Home Folder',
                icon: 'pi pi-fw pi-home',
                children: [{
                    key: '0-1-0',
                    label: 'Invoices.txt',
                    icon: 'pi pi-fw pi-file',
                    data: 'Invoices for this month'
                }]
            }
        ]
    },
    {
        key: '1',
        label: 'Events',
        data: 'Events Folder',
        icon: 'pi pi-fw pi-calendar',
        children: [
            {key: '1-0', label: 'Meeting', icon: 'pi pi-fw pi-calendar-plus', data: 'Meeting'},
            {key: '1-1', label: 'Product Launch', icon: 'pi pi-fw pi-calendar-plus', data: 'Product Launch'},
            {key: '1-2', label: 'Report Review', icon: 'pi pi-fw pi-calendar-plus', data: 'Report Review'}
        ]
    },
    {
        key: '2',
        label: 'Movies',
        data: 'Movies Folder',
        icon: 'pi pi-fw pi-star-fill',
        children: [
            {
                key: '2-0',
                icon: 'pi pi-fw pi-star-fill',
                label: 'Al Pacino',
                data: 'Pacino Movies',
                children: [
                    {key: '2-0-0', label: 'Scarface', icon: 'pi pi-fw pi-video', data: 'Scarface Movie'},
                    {key: '2-0-1', label: 'Serpico', icon: 'pi pi-fw pi-video', data: 'Serpico Movie'}
                ]
            },
            {
                key: '2-1',
                label: 'Robert De Niro',
                icon: 'pi pi-fw pi-star-fill',
                data: 'De Niro Movies',
                children: [
                    {key: '2-1-0', label: 'Goodfellas', icon: 'pi pi-fw pi-video', data: 'Goodfellas Movie'},
                    {key: '2-1-1', label: 'Untouchables', icon: 'pi pi-fw pi-video', data: 'Untouchables Movie'}
                ]
            }
        ]
    }
];

export const App: FC = () => {
    const [text, setText] = useState<string>('');
    const scrollableTabs = Array.from({length: 50}, (_, i) => ({
        title: `Tab ${i + 1}`,
        content: `Tab ${i + 1} Content`
    }))
    const [nodes, setNodes] = useState<TreeNode[]>(tree_data);

    return (
        <div id={"eln"}>
            <Card id={"sidebar"}>
                <Tree value={nodes} filter filterMode="lenient" filterPlaceholder="Lenient Filter" dragdropScope="eln_tree" onDragDrop={(e) => setNodes(e.value)} className="w-full md:w-30rem"/>
            </Card>
            <Card id={"right"}
                style={{height: '100%'}}
                pt={{
                    root: {style: {height: '100%'}},
                    body: {style: {height: '100%'}},
                    content: {style: {height: '100%'}}
                }}
            >
                <TabView
                    scrollable
                    style={{height: '100%', display: 'flex', flexFlow: 'column nowrap'}}
                    pt={{
                        navContainer: {style: {flex: '0 0 auto'}},
                        panelContainer: {style: {flex: '1 1 auto'}},
                    }}
                >
                    {scrollableTabs.map((tab) => (
                        <TabPanel
                            key={tab.title}
                            header={tab.title}
                            closable
                            style={{height: '100%'}}
                            pt={{
                                content: {style: {height: '100%'}}
                            }}
                        >
                            <Editor
                                value={text}
                                onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue!)}
                                pt={{
                                    root: {style: {height: '100%', display: 'flex', flexFlow: 'column nowrap'}},
                                    toolbar: {style: {flex: '0 0 auto'}},
                                    content: {style: {flex: '1 1 auto'}}
                                }}
                            />
                        </TabPanel>
                    ))}
                </TabView>
            </Card>
        </div>
    )
};