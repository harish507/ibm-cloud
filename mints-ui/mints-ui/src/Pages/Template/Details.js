import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import TextBox from '../../Controls/TextBox'
import DropDown from '../../Controls/DropDown'

export default function Details (props) {
	const [ category, setCategory ] = useState(props.category)
	const [ name, setName ] = useState(props.name)
	const [ description, setDescription ] = useState(props.description)

	const changeCategory = (value) => {
		setCategory(value)
		handleChange(value, name, description)
	}
	const changeName = (value) => {
		setName(value)
		handleChange(category, value, description)
	}
	const changeDescription = (value) => {
		setDescription(value)
		handleChange(category, name, value)
	}
	const handleChange = (_category, _name, _description) => {
		props.handleChange(null)
		props.handleChange({ category: _category, name: _name, description: _description })
	}

	return (
		<Grid container spacing={1}>
			<Grid item md={1} sm={3} xs={12}>
				<TextBox label="ID" value={props.id} 
                    //onChange= {e => changeCategory(e.target.value)}
                    error={props.validate && props.category === ''} 
                />
			</Grid>
			<Grid item md={2} sm={3} xs={12}>
				<DropDown
					new
					label='Category'
					items={props.categories}
					value={category}
					onChange={(val) => changeCategory(val)}
				/>
				{/* <TextBox label="Category" value={category} 
                    onChange= {e => changeCategory(e.target.value)}
                    error={props.validate && props.category === ''} 
                /> */}
			</Grid>
			<Grid item md={4} sm={6} xs={12}>
				<TextBox
					label='Name'
					value={name}
					onChange={(e) => changeName(e.target.value)}
					error={props.validate && props.name === ''}
				/>
			</Grid>
			<Grid item md={5} sm={12} xs={12}>
				<TextBox
					multiline
					label='Description'
					value={description}
					onChange={(e) => changeDescription(e.target.value)}
					error={props.validate && props.description === ''}
				/>
			</Grid>
		</Grid>
	)
}
