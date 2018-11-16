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
import {setDeleteDialog, setAddDialog, setEditDialog, setItemValue, setItemObject} from "./store/actions";

type Props = {};

class Main extends Component<Props> {

    state = {
        width: Dimensions.get("window").width,
        selectedTab: 'not_completed',
        editDialog: false,
        item: {
            name: '',
            priority: 0,
            isCompleted: false
        },
        items: []
    };

    onTabClickHandler = selectedTab => {
        this.setState({
            selectedTab: selectedTab
        });
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

    deleteItemHandler = () => {
      const items = this.state.items.filter(item => item.index !== this.props.item.index);
      this.setState({
          items: [ ...items ]
      });
      this.props.setDeleteDialog(false);
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

    // comparing priorities
    compare = (a, b) => {
        if (a.priority < b.priority)
            return -1;
        if (a.priority > b.priority)
            return 1;
        return 0;
    };


    render() {

        const items = this.state.items.filter(item => (item.isCompleted === (this.state.selectedTab === 'completed')));
        items.sort(this.compare);
        const deleteItemText = `Delete idem "${this.props.item.name}"?`;


        return(
            <ScrollView>
                <View>
                    <ButtonWithBackground color="#0099CC" onPress={() => this.props.setAddDialog(true)}>Add item</ButtonWithBackground>
                </View>
                <View style={styles.tabs}>
                    <View style={styles.tab}>
                        <ButtonWithBackground color="#0099CC" onPress={() => this.onTabClickHandler('not_completed')} disabled={this.state.selectedTab === 'not_completed'}>Not completed</ButtonWithBackground>
                    </View>
                    <View style={styles.tab}>
                        <ButtonWithBackground color="#0099CC" onPress={() => this.onTabClickHandler('completed')} disabled={this.state.selectedTab === 'completed'}>Completed</ButtonWithBackground>
                    </View>
                </View>
                <View style={styles.container}>
                    {items.length > 0 ?
                        items.map(item => (
                            <TodoItem item={item} width={this.state.width} key={item.index}/>
                        )) :
                        <Text style={{textAlign: 'center'}}> No tasks. </Text>}
                </View>
                <Dialog.Container visible={this.props.addDialog}>
                    <Dialog.Title>Add task</Dialog.Title>
                    <Dialog.Input label="Name" style={styles.input} value={this.props.item.name} onChangeText={(text) => this.props.setItemValue('name', text)} />
                    <Dialog.Input label="Priority" keyboardType="number-pad" style={styles.input} value={this.props.item.priority.toString()} onChangeText={(text) => this.props.setItemValue('priority', text)} />
                    <Dialog.Switch label="Completed?" value={this.props.item.isCompleted}  onValueChange={(value) => this.props.setItemValue('isCompleted', value)} />
                    <Dialog.Button label="Cancel" onPress={this.onCancelEditClickHandler} />
                    <Dialog.Button label="Save" onPress={this.onSaveHandler} />
                </Dialog.Container>
                <Dialog.Container visible={this.props.deleteDialog}>
                    <Dialog.Title>Remove task</Dialog.Title>
                    <Dialog.Description>
                        {deleteItemText}
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={() => this.props.setDeleteDialog(false)} />
                    <Dialog.Button label="Delete" onPress={this.deleteItemHandler} />
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
    },
    tabs: {
        flexDirection: 'row',
        flex: 1
    },
    tab: {
        flex: 1
    }
});

const mapStateToProps = state => ({
    editDialog: state.editDialog,
    addDialog: state.addDialog,
    deleteDialog: state.deleteDialog,
    item: state.item
});

const mapDispatchToProps = dispatch => ({
    setAddDialog: addDialog => dispatch(setAddDialog(addDialog)),
    setEditDialog: editDialog => dispatch(setEditDialog(editDialog)),
    setDeleteDialog: deleteDialog => dispatch(setDeleteDialog(deleteDialog)),
    setItemValue: (name, value) => dispatch(setItemValue(name, value)),
    setItemObject: item => dispatch(setItemObject(item))
});


export default connect(mapStateToProps, mapDispatchToProps) (Main);