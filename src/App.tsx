import React, { Suspense, lazy } from 'react'
import { create } from 'jss'
import {
    jssPreset,
    StylesProvider,
    createStyles,
    makeStyles
} from '@material-ui/core'
import ProgressFallback from './components/ProgressFallback'
import CoreLayout from 'src/layouts/CoreLayout'
const jss = create({ plugins: [...jssPreset().plugins] })

const useStyles = makeStyles(() => createStyles({
    '@global': {
        '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
        },
        html: {
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale',
            height: '100%',
            width: '100%'
        },
        body: {
            height: '100%',
            width: '100%'
        },
        '#root': {
            height: '100%',
            width: '100%'
        }
    }
}))

const KanbanBoard = lazy(() => import('src/pages/kanbanBoard'));
const title = 'Kanban Board MSVI test'

const App = () => {
    useStyles()
    return(
        <StylesProvider jss={jss}>
            <Suspense fallback={<ProgressFallback />}>
                <CoreLayout title={title}>
                    <KanbanBoard />
                </CoreLayout>
            </Suspense>
        </StylesProvider>
    )
}

export default App
