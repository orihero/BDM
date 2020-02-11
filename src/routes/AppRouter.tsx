import React from 'react'
import Navigation from './Routes'
import { View, StyleSheet } from 'react-native';
import Modal from '../components/Modal';


let RouterWithAppState = () => {
  return <Navigation />
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})


export default RouterWithAppState
