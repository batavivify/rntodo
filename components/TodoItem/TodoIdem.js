import React, {Component} from "react";
import { connect } from 'react-redux';
import {Text, View, StyleSheet} from "react-native";
import {setAddDialog, setItemObject} from '../../store/actions';

class TodoItem extends Component<Props> {

    render() {
        return (
          <View style={styles.item}>
              <Text style={{width: this.props.width - 120}}>{this.props.item.name}</Text>
          </View>
        );
    }

}

const styles = StyleSheet.create({
    item: {
        flex: 1,
            padding: 10,
            margin: 5,
            borderWidth: 1,
            borderColor: '#ccc',
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center'
    }
});

const mapDispatchToProps = dispatch => ({
    setAddDialog: addDialog => dispatch(setAddDialog(addDialog)),
    setItemObject: item => dispatch(setItemObject(item))
});

export default connect(null, mapDispatchToProps)(TodoItem);