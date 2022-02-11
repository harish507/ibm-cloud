import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextBox from '../../Controls/TextBox'

import _ from 'lodash'


export default function Entry(props) {
    const [item, setItem] = React.useState(props.item)
    //const formats = Object.keys(props.type.format)

    const handleChange = (ind,value) => {
        let tmp = [...item]
        tmp[ind].value = value
        setItem(tmp)
    }

    const submitForm = e => {
        e.preventDefault()
        props.onSave(item)
    }

    return (
        <div>
            <Dialog open={item ? true : false} onClose={props.onCancel} maxWidth="xs" fullWidth  >
                <DialogTitle id="form-dialog-title">{_.startCase(props.title)}</DialogTitle>
                <form>
                <DialogContent>
                    {item.map((prop,index) => {
                        return <TextBox key={index} label={_.startCase(prop.key) + (index ===0 ? ' * ': '')} 
                            value={prop.value} autoFocus={index===0}
                            onChange= {e => handleChange(index, e.target.value)}
                        />
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onCancel} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={submitForm} color="primary">
                        Save
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}
