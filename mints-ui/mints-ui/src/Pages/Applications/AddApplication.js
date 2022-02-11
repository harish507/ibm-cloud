import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextBox from '../../Controls/TextBox'
import _ from 'lodash'

export default function AddApplication(props) {
    
    return (
        <div className='content'>
            <div style={{ width: '80%', paddingLeft: '10%' }}>
                <Dialog open={props.addAppConfig ? true : false} onClose={props.onCancel} maxWidth='sm' fullWidth>
                    <DialogTitle id='form-dialog-title'>Create Application Configuration</DialogTitle>
                    <form>
                        <DialogContent>
                            <TextBox
                                label='Application Name *'
                                id='name'
                                autoFocus={true}
                                value={props.addAppConfig.name}
                                onChange={(e) => props.handleChange('name', e.target.value)}
                            />
                            <TextBox
                                label='Connection *'
                                id='connection'
                                value={props.addAppConfig.connection = props.addAppConfig.name ? _.startCase(_.camelCase(_.toLower(props.addAppConfig.name))).replace(new RegExp(' ', 'g'), '') : ''}
                                onChange={(e) => props.handleChange('connection', e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button variant='outlined' onClick={props.onCancel} color='primary'>
                                Close
							</Button>
                            <Button variant='contained' type='submit' onClick={props.submitAppConfig} color='primary'>
                                Save
							</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        </div>
    )
}
