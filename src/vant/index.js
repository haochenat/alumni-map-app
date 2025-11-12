import { Search, Button, Cell, Switch, List, Icon, Form, Field, CellGroup, Popup, RadioGroup, Radio, Dialog, Toast } from 'vant'

export default {
    install(app) {
        app.use(Search)
        app.use(Button)
        app.use(Cell)
        app.use(Switch)
        app.use(List)
        app.use(Icon)
        app.use(Form)
        app.use(Field)
        app.use(CellGroup)
        app.use(Popup)
        app.use(RadioGroup)
        app.use(Radio)
        app.use(Dialog)
        app.use(Toast)
    }
}