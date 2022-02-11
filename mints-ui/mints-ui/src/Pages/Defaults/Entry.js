import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextBox from '../../Controls/TextBox'

// import _ from 'lodash'


export default function Entry(props) {
    const [item, setItem] = React.useState(props.item)
    //const formats = Object.keys(props.type.format)

    const handleKeyChange = (key) => {
        setItem({key,value:item.value})
    }
    const handleValueChange = (value) => {
        setItem({key:item.key,value})
    }

    const submitForm = e => {
        e.preventDefault()
        props.onSave(item)
    }

    return (
        <div>
            <Dialog open={item ? true : false} onClose={props.onCancel} maxWidth="sm" fullWidth  >
                <DialogTitle id="form-dialog-title">Default Property</DialogTitle>
                <form>
                <DialogContent>
                    <TextBox label="Property *" disabled={props.disabled}
                            value={item.key} autoFocus={true}
                            onChange= {e => handleKeyChange( e.target.value)}
                    />
                    <TextBox label="Value *"
                            value={item.value} autoFocus={props.disabled}
                            onChange= {e => handleValueChange(e.target.value)}
                    />
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
