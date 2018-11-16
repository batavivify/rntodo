import React, {Component} from "react";
import { connect } from 'react-redux';
import {Text, View, StyleSheet} from "react-native";
import ButtonWithBackground from "../ButtonWithBackground/ButtonWithBackground";
import Icon from 'react-native-vector-icons/Ionicons';
import {setAddDialog, setEditDialog, setItemObject} from '../../store/actions';

class TodoItem extends Component<Props> {

    constructor(props){
        super(props);
    }

    onEditDialogClickHandler = item => {
        this.props.setItemObject({
            ...item
        });
        this.props.setAddDialog(true);
    };


    render() {
        return (
          <View style={styles.item}>
              <Text style={{width: this.props.width - 80}}>{this.props.item.name}</Text>
              <View style={[styles.buttons, {width: 80, textAlign: 'right'}]}>
                  <ButtonWithBackground color="#008000" width={35} onPress={() => this.onEditDialogClickHandler(this.props.item)}>
                      <Icon name="md-create" size={20} />
                  </ButtonWithBackground>
              </View>
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
    setEditDialog: editDialog => dispatch(setEditDialog(editDialog)),
    setAddDialog: addDialog => dispatch(setAddDialog(addDialog)),
    setItemObject: item => dispatch(setItemObject(item))
});

export default connect(null, mapDispatchToProps)(TodoItem);