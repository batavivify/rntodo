import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';
import TodoItem from './components/TodoItem/TodoIdem';
import ButtonWithBackground from "./components/ButtonWithBackground/ButtonWithBackground";
import Dialog from "react-native-dialog";
import {setAddDialog, setEditDialog, setItemValue, setItemObject} from "./store/actions";

type Props = {};

class Main extends Component<Props> {

    state = {
        width: Dimensions.get("window").width,
        editDialog: false,
        items: []
    };

    onSaveHandler = () => {
        const item = {
            index: this.props.item.index,
            name: this.props.item.name,
            priority: this.props.item.priority,
            isCompleted: this.props.item.isCompleted
        };
        if (item.index > 0) {
            const items = this.state.items.map(it => {
                if (it.index === item.index) {
                    return item;
                }
                return it;
            });
            this.setState({
                items: [ ...items ]
            });
        } else {
            this.setState({
                items: [ ...this.state.items, {
                    ...item,
                    index: new Date().getTime()
                } ]
            });
        }
        this.props.setItemObject({
            index: 0,
            name: '',
            priority: 0,
            isCompleted: false
        });
        this.props.setAddDialog(false);
    };

    onCancelEditClickHandler = () => {
        this.props.setItemObject({
            index: 0,
            name: '',
            priority: 0,
            isCompleted: false
        });
        this.props.setAddDialog(false);
    };


    render() {


        return(
            <ScrollView>
                <View>
                    <ButtonWithBackground color="#0099CC" onPress={() => this.props.setAddDialog(true)}>Add item</ButtonWithBackground>
                </View>
                <View style={styles.container}>
                    {this.state.items.length > 0 ?
                        this.state.items.map(item => (
                            <TodoItem item={item} width={this.state.width} key={item.index}/>
                        )) :
                        <Text style={{textAlign: 'center'}}> Lista je prazna </Text>}
                </View>
                <Dialog.Container visible={this.props.addDialog}>
                    <Dialog.Title>Add task</Dialog.Title>
                    <Dialog.Input label="Name" style={styles.input} value={this.props.item.name} onChangeText={(text) => this.props.setItemValue('name', text)} />
                    <Dialog.Input label="Priority" keyboardType="number-pad" style={styles.input} value={this.props.item.priority.toString()} onChangeText={(text) => this.props.setItemValue('priority', text)} />
                    <Dialog.Switch label="Done?" value={this.props.item.isCompleted}  onValueChange={(value) => this.props.setItemValue('isCompleted', value)} />
                    <Dialog.Button label="Cancel" onPress={this.onCancelEditClickHandler} />
                    <Dialog.Button label="Save" onPress={this.onSaveHandler} />
                </Dialog.Container>
            </ScrollView>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc'
    }
});

const mapStateToProps = state => ({
    addDialog: state.addDialog,
    deleteDialog: state.deleteDialog,
   item: state.item
});

const mapDispatchToProps = dispatch => ({
    setAddDialog: addDialog => dispatch(setAddDialog(addDialog)),
    setEditDialog: editDialog => dispatch(setEditDialog(editDialog)),
    setItemValue: (name, value) => dispatch(setItemValue(name, value)),
    setItemObject: item => dispatch(setItemObject(item))
});


export default connect(mapStateToProps, mapDispatchToProps) (Main);