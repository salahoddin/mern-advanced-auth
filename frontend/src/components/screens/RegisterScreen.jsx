import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './RegisterScreen.css'

const RegisterScreen = ({ history }) => {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		if (localStorage.getItem('authToken')) {
			history.push('/')
		}
	}, [history])

	const registerHandler = async (e) => {
		e.preventDefault()

		const config = {
			header: {
				'Content-Type': 'application/json',
			},
		}
		if (password !== confirmPassword) {
			setPassword('')
			setConfirmPassword('')
			setTimeout(() => {
				setError('')
			}, 5000)
			return setError('Passwords did not match')
		}

		try {
			const { data } = await axios.post(
				'/api/users/register',
				{ username, email, password },
				config
			)
			localStorage.setItem('authToken', data.token)

			history.push('/')
		} catch (error) {
			setError(error.response.data.error)
			setTimeout(() => {
				setError('')
			}, 5000)
		}
	}

	return (
		<div className='register-screen'>
			<form onSubmit={registerHandler} className='register-screen__form'>
				<h3 className='register-screen__title'>Register</h3>
				{error && <span className='error-message'>{error}</span>}
				<div className='form-group'>
					<label htmlFor='name'>Username:</label>
					<input
						type='text'
						required
						id='name'
						placeholder='Enter username...'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						tabIndex={1}
					></input>
				</div>
				<div className='form-group'>
					<label htmlFor='email'>Email:</label>
					<input
						type='email'
						required
						id='email'
						placeholder='Enter email...'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						tabIndex={2}
					></input>
				</div>
				<div className='form-group'>
					<label htmlFor='password'>Password:</label>
					<input
						type='password'
						required
						id='password'
						placeholder='Enter password...'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						tabIndex={3}
					></input>
				</div>
				<div className='form-group'>
					<label htmlFor='confirmpassword'>Confirm Password:</label>
					<input
						type='password'
						required
						id='confirmpassword'
						placeholder='Confirm password...'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						tabIndex={4}
					></input>
				</div>
				<button type='submit' className='btn btn-primary' tabIndex={5}>
					Register
				</button>
				<span className='register-screen__subtext'>
					Already have an account?{' '}
					<Link to='/login' tabIndex={6}>
						Log in
					</Link>
				</span>
			</form>
		</div>
	)
}
export default RegisterScreen
