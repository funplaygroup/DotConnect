import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import Engine from '../../../core/Engine';
import FoxScreen from '../../UI/FoxScreen';
import SecureKeychain from '../../../core/SecureKeychain';
/**
 * Entry Screen that decides which screen to show
 * depending on the state of the user
 * new, existing , logged in or not
 * while showing the fox
 */
export default class Entry extends Component {
	static propTypes = {
		/**
		 * The navigator object
		 */
		navigation: PropTypes.object
	};

	async componentDidMount() {
		const existingUser = await AsyncStorage.getItem('@MetaMask:existingUser');
		if (existingUser !== null) {
			await this.unlockKeychain();
		} else {
			this.goToOnboarding();
		}
	}

	async unlockKeychain() {
		try {
			// Retreive the credentials
			const credentials = await SecureKeychain.getGenericPassword();
			if (credentials) {
				// Restore vault with existing credentials
				const { KeyringController } = Engine.context;
				await KeyringController.submitPassword(credentials.password);
				this.goToWallet();
			} else {
				this.goToLogin();
			}
		} catch (error) {
			console.log(`Keychain couldn't be accessed`, error); // eslint-disable-line
			this.goToLogin();
		}
	}

	goToOnboarding() {
		this.props.navigation.navigate('OnboardingRootNav');
	}

	goToWallet() {
		this.props.navigation.navigate('HomeNav');
	}

	goToLogin() {
		this.props.navigation.navigate('Login');
	}

	render = () => <FoxScreen />;
}