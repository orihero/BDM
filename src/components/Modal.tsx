import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Dimensions } from "react-native";

let { width, height } = Dimensions.get("window");

const Modal = ({ isOpen = true, children }) => {
	const [visible, setVisible] = useState(isOpen);
	let animation = new Animated.Value(0);
	let animate = () => {
		Animated.spring(animation, {
			toValue: isOpen ? 1 : 0
		}).start(() => {
			if (!isOpen) {
				setVisible(!visible);
			}
		});
		return animate;
	};
	let backgroundColor = animation.interpolate({
		inputRange: [0, 1],
		outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]
	});
	let scale = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0.5, 1],
		extrapolate: "clamp"
	});
	useEffect(animate, [isOpen]);
	if (!visible) {
		return null;
	}

	return (
		<Animated.View style={[styles.container, { backgroundColor }]}>
			<Animated.View style={[{ transform: [{ scale }] }]}>
				{children}
			</Animated.View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "absolute",
		width,
		height,
		alignItems: "center",
		zIndex: 100,
		paddingTop: 40
	}
});

export default Modal;
