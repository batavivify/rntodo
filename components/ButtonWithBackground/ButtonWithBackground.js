import React from "react";
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    View,
    StyleSheet,
    Platform
} from "react-native";

const buttonWithBackground = props => {

    const content = (
        <View style={[styles.button, {backgroundColor: props.color, width: props.width}, props.disabled ? styles.disabled : null]}>
            <Text style={[styles.text, props.disabled ? styles.disabledText : null]}>{props.children}</Text>
        </View>
    );

    if (props.disabled) {
        return content;
    }

    if (Platform.OS === "android") {
        return (
            <TouchableWithoutFeedback onPress={props.onPress}>
                {content}
            </TouchableWithoutFeedback>
        );
    }

    return (
        <TouchableOpacity onPress={props.onPress}>
            {content}
        </TouchableOpacity>
    );

};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        margin: 5,
        borderRadius: 5
    },
    text: {
        color: "white",
        textAlign: 'center'
    },
    disabled: {
        backgroundColor: "#eee"
    },
    disabledText: {
        color: "#aaa"
    }
});

export default buttonWithBackground;