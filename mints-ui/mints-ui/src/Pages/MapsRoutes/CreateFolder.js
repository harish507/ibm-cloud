import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextBox from '../../Controls/TextBox'

export default function CreateFolder(props) {
    const submitForm = e => {
        e.preventDefault()
        props.saveFolder(props.folder)
    }
    return (
        <div className='content'>
            <div style={{ width: '80%', paddingLeft: '10%' }}>
                <Dialog open={props.item ? true : false}onClose={props.onCancel} maxWidth='sm'>
                    <form>
                        <DialogContent>
                            <TextBox
                                label='New Folder *'
                                id='newFolder'
                                value={props.folder}
                                onChange={e => props.handleChange(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button variant='contained' type='submit' color='primary' onClick={submitForm}>
                                Create
							</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        </div>
    )
}