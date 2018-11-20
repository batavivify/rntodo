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
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

type Props = {};

class Main extends Component<Props> {
    apiUrl = 'https://f4b3467e.ngrok.io/api';

    state = {
        width: Dimensions.get("window").width,
        selectedTab: 'not_completed',
        editDialog: false,
        item: {
            name: '',
            priority: 0,
            isCompleted: false
        },
        items: [],
        userDialog: false,
        userEmail: '',
        userPassword: '',
        newUser: false,
        token: ''
    };

    onTabClickHandler = selectedTab => {
        this.setState({
            selectedTab: selectedTab
        });
    };

    getItems = () => {
        const _self = this;
        axios.get(`${this.apiUrl}/tasks`, {
            headers: {
                Authorization: `Bearer ${this.state.token}`,
            }
        })
            .then(function (response) {
                console.log(response);
                const items = response.data.map(item => ({
                    index: item.id,
                    name: item.name,
                    priority: item.priority,
                    isCompleted: item.is_completed
                }));
                console.log(items);
                _self.setState({
                    items: items
                });
            })
            .catch(function (error) {
                // TODO: handle error
                console.log(error);
            });
    };

    onSaveHandler = () => {
        const _self = this;

        const item = {
            index: this.props.item.index,
            name: this.props.item.name,
            priority: this.props.item.priority,
            isCompleted: this.props.item.isCompleted
        };
        if (item.index > 0) {
            axios.put(`${this.apiUrl}/task/${item.index}`, {
              name: this.props.item.name,
              priority: this.props.item.priority,
              is_completed: this.props.item.isCompleted
          })
              .then(function (response) {
                  console.log(response);
                  const items = _self.state.items.map(it => {
                      if (it.index === item.index) {
                          return item;
                      }
                      return it;
                  });
                  _self.setState({
                      items: [ ...items ]
                  });
                  _self.props.setItemObject({
                      index: 0,
                      name: '',
                      priority: 0,
                      isCompleted: false
                  });
                  _self.props.setAddDialog(false);
              })
              .catch(function (error) {
                  // TODO: handle error
                  console.log(error);
              });

        } else {
            axios.post(`${this.apiUrl}/task`, {
                name: this.props.item.name,
                priority: this.props.item.priority,
                is_completed: this.props.item.isCompleted
            }, {
                headers: {
                    Authorization: `Bearer ${this.state.token}`,
                }
            })
                .then(function (response) {
                    console.log(response);
                    const item = {
                        index: response.data.id,
                        name: response.data.name,
                        priority: response.data.priority,
                        isCompleted: response.data.is_completed
                    };
                    const items = _self.state.items.slice();
                    items.push(item);
                    _self.setState({
                        items: items
                    });
                    _self.props.setItemObject({
                        index: 0,
                        name: '',
                        priority: 0,
                        isCompleted: false
                    });
                    _self.props.setAddDialog(false);
                })
                .catch(function (error) {
                    // TODO: handle error
                    console.log(error);
                });
        }
    };

    deleteItemHandler = () => {
      const _self = this;
      const task = this.props.item.index;
      console.log(task);
      axios.delete(`${this.apiUrl}/task/${task}`, {
          headers: {
              Authorization: `Bearer ${this.state.token}`,
              'Content-type': 'application/x-www-form-urlencoded'
          }
      })
          .then(function (response){
              console.log(response);
        })
          .catch(function (error) {
              // TODO: handle error
              console.log(error);
          });

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

    userDialogHandler = userDialog => {
        this.setState({
            userDialog: userDialog
        })
    };

    loginRegisterUserHandler = () => {
        const _self = this;
        const url = (this.state.newUser) ? `${this.apiUrl}/auth/register` : `${this.apiUrl}/auth/login`;
        axios.post(url, {
            email: this.state.userEmail,
            password: this.state.userPassword
        })
            .then(function (response) {
                console.log(response);
                _self.setState({
                    token: response.data.access_token
                }, () => {
                    _self.getItems();
                });
                _self.userDialogHandler(false);
            })
            .catch(function (error) {
                // TODO: handle error
                console.log(error);
            });
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
                    {!this.state.token &&
                    <ButtonWithBackground color="#0099CC" onPress={() => this.userDialogHandler(true)}>
                        <Icon name="md-log-in" size={20} /> Login/Register
                    </ButtonWithBackground>}
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
                    <Dialog.Title>Add/edit task</Dialog.Title>
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
                <Dialog.Container visible={this.state.userDialog}>
                    <Dialog.Title>Login/Register</Dialog.Title>
                    <Dialog.Input label="Email" style={styles.input} value={this.state.userEmail} onChangeText={(text) => this.setState({'userEmail': text})} keyboardType="email-address" autoCapitalize="none" />
                    <Dialog.Input label="Password" style={styles.input} value={this.state.userPassword} onChangeText={(text) => this.setState({'userPassword': text})} secureTextEntry={true} autoCapitalize="none" />
                    <Dialog.Switch label="New user?" value={this.state.newUser}  onValueChange={(value) => this.setState({'newUser': value})} />
                    <Dialog.Button label="Cancel" onPress={() => this.userDialogHandler(false)} />
                    <Dialog.Button label="Save" onPress={this.loginRegisterUserHandler} />
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