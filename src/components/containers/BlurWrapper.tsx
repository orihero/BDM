import React, { Component } from "react";
import {
	findNodeHandle,
	Platform,
	Dimensions,
	ActivityIndicator,
	View,
	Animated
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import LoadingModal from "../LoadingModal";
import { connect } from "react-redux";
import FloatingMessage from "../FloatingMessage";
import { colors } from "../../constants";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
	"window"
);
const isAndroid = Platform.OS === "android";

class BlurWrapper extends Component {
	state = {
		// this applies only to android. For ios we can always blur the view, but in android one needs
		// to wait until the view to be blurred is rendered.
		translateY: new Animated.Value(-100)
	};

	/*
	 * When the view to be blurred changes, we reset the component and start from the beggining.
	 */
	// componentDidMount() {
	// 	if (isAndroid && !this.props.isLoading) {
	// 		this.viewRef = null;
	// 		this.nodeHandleRef = null;
	// 		this.setState({ canBlurInAndroid: false });
	// 	}
	// }

	/*
	 * Finds the element reference and passes it to the BlurView.
	 */

	render() {
		// // if we are not blurring, we just retun the children back..
		// if (!this.props.showBlur) {
		//     return this.props.children;
		// }

		// children that needs to be blurred.
		const { children, loading, error, loadingMessage } = this.props;

		const { translateY } = this.state;

		// we can accept only one child.
		// If you have mutliple child make sure you render it wrapped inside a `View``
		const isValidChild = React.isValidElement(children);
		if (!isValidChild) {
			console.error(
				"WrappedBlurView expects child to be a single element."
			);
			return null;
		}

		/* Prepare the style */
		// in android.. we the actual blurred view to be hidden slightly for the blur to be visible properly
		let newStyles = [];
		const myStyleOpactiy = {
			opacity: isAndroid ? 0.3 : 1,
			flex: 1
		};

		if (children.props.style instanceof Array) {
			newStyles = [...children.props.style, myStyleOpactiy];
		} else {
			if (!children.props.style) {
				newStyles.push(children.props.style);
			}
			newStyles.push(myStyleOpactiy);
		}
		/* Prepare the style */
		if (!loading && !error) {
			return this.props.children;
		}
		// render the actual element with blur view..
		if (!loading) {
			return (
				<>
					{React.cloneElement(this.props.children)}
					{error && (
						<FloatingMessage
							translateY={translateY}
							type={error.type}
							text={error.message}
						/>
					)}
				</>
			);
		}

		return (
			<React.Fragment>
				{React.cloneElement(children, {
					...children.props,
					ref: el => {
						if (el && el !== this.viewRef) {
							this.viewRef = el;
							this.blur;
						}
					},
					style: newStyles
				})}
				{loading && (
					<View
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							top: 0,
							right: 0,
							width: viewportWidth,
							height: viewportHeight,
							opacity: 0.7,
							backgroundColor: colors.white
						}}
					/>
				)}
				<LoadingModal loadingMessage={loadingMessage} />
				{error && (
					<FloatingMessage
						translateY={translateY}
						type={error.type}
						text={error.message}
					/>
				)}
			</React.Fragment>
		);
	}
}

BlurWrapper.defaultProps = {
	blurAmount: 30,
	showBlur: true
};

const mapStateToProps = ({ appState }) => {
	let { loading, error, loadingMessage } = appState;
	return {
		loading,
		error,
		loadingMessage
	};
};

export default connect(mapStateToProps)(BlurWrapper);
