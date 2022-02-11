import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextBox from '../../Controls/TextBox'

export default function Entry({ uiRef, subscriber, onCancel, onSave}) {
    const [item, setItem] = React.useState(subscriber ? subscriber: {name: ''})

    const handleChange = (key,value) => {
        setItem({...item,[key]:value})
    }

    const submitForm = e => {
        e.preventDefault()
        onSave(item)
    }

    return (
        <div>
            <Dialog open={item ? true : false} onClose={onCancel} maxWidth="xs" fullWidth  >
                <DialogTitle id="form-dialog-title">Subscriber details</DialogTitle>
                <form>
                <DialogContent>
                    <TextBox label='Name *'
                        value={item.name} autoFocus={true}
                        onChange= {e => handleChange('name', e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
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
