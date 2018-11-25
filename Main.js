import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions,
    AsyncStorage
} from 'react-native';
import TodoItem from './components/TodoItem/TodoIdem';
import ButtonWithBackground from "./components/ButtonWithBackground/ButtonWithBackground";
import Dialog from "react-native-dialog";
import {setDeleteDialog, setAddDialog, setEditDialog, setItemValue, setItemObject} from "./store/actions";
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import DefaultInput from './components/DefaultInput/DefaultInput';
import Loader from './components/Loader/Loader';

type Props = {};

class Main extends Component<Props> {
    apiUrl = 'https://e436b4cb.ngrok.io/api';

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
        token: '',
        loadingLogin: false,
        pageLoaded: false,
        loading: false,
    };

    async componentDidMount() {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            this.refreshTokenHandler(token);
        } else {
            this.setState({
                pageLoaded: true
            });
        }
    }

    onTabClickHandler = selectedTab => {
        this.setState({
            selectedTab: selectedTab
        });
    };

    getItems = () => {
        const _self = this;
        _self.setState({
            loading: true
        });
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
                    items: items,
                    loading: false
                });
            })
            .catch(function (error) {
                // TODO: handle error
                _self.setState({
                    loading: false
                });
                console.log(error);
            });
    };

    onSaveHandler = () => {
        const _self = this;

        const priorityValidated = this.props.item.priority;
        const nameValidated = this.props.item.name;

        if((priorityValidated >= 0 && priorityValidated <= 9) && priorityValidated !== '') {
            if(nameValidated !== '') {
                const item = {
                    index: this.props.item.index,
                    name: nameValidated,
                    priority: priorityValidated,
                    isCompleted: this.props.item.isCompleted
                };
                if (item.index > 0) {
                    _self.setState({
                        loading: true
                    });
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
                                items: [ ...items ],
                                loading: false
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
                            _self.setState({
                                loading: false
                            });
                            console.log(error);
                        });

                } else {
                    _self.setState({
                        loading: true
                    });
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
                                items: items,
                                loading: false
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
                            _self.setState({
                                loading: false
                            });
                            console.log(error);
                        });
                }
            } else {
                alert('Task name should not be empty!');
            }
        } else {
            alert('Priority must be between 0 and 9!');
        }
    };

    deleteItemHandler = () => {
      const task = this.props.item.index;
      const _self = this;
      console.log(task);
        _self.setState({
            loading: true
        });
      axios.delete(`${this.apiUrl}/task/${task}`, {
          headers: {
              Authorization: `Bearer ${this.state.token}`,
              'Content-type': 'application/x-www-form-urlencoded'
          }
      })
          .then(function (response){
              _self.setState({
                  loading: false
              });
              console.log(response);
        })
          .catch(function (error) {
              // TODO: handle error
              _self.setState({
                  loading: false
              });
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

    loginRegisterUserHandler = () => {
        const _self = this;
        _self.setState({
            loadingLogin: true,
            loading: true
        });
        const url = (this.state.newUser) ? `${this.apiUrl}/auth/register` : `${this.apiUrl}/auth/login`;
        axios.post(url, {
            name: this.state.userName,
            email: this.state.userEmail,
            password: this.state.userPassword
        })
            .then(function (response) {
                console.log(response);
                _self.setState({
                    token: response.data.access_token,
                    loadingLogin: false,
                    loading: false
                }, () => {
                    _self.getItems();
                });
                AsyncStorage.setItem('token', response.data.access_token);
            })
            .catch(function (error) {
                // TODO: handle error
                console.log(error);
                _self.setState({
                    loadingLogin: false,
                    loading: false
                });
            });
    };

    refreshTokenHandler = token => {
        const _self = this;
        /*_self.setState({
          loadingLogin: true
        });*/
        axios.post(`${this.apiUrl}/auth/refresh`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                console.log(response);
                _self.setState({
                    token: response.data.access_token,
                    pageLoaded: true
                }, () => {
                    _self.getItems();
                });
                AsyncStorage.setItem('token', response.data.access_token);
            })
            .catch(function (error) {
                // TODO: handle error
                console.log(error);
                _self.setState({
                    pageLoaded: true
                });
            });
    };

    logoutUserHandler = () => {
        this.setState({
            items: [],
            userName: '',
            userEmail: '',
            userPassword: '',
            newUser: false,
            token: ''
        });
        AsyncStorage.removeItem('token');
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
                <Loader
                    loading={this.state.loading}
                />
                {this.state.pageLoaded &&
                <View>
                    {this.state.token ?
                        <View>
                            <View style={styles.top_buttons}>
                                {this.state.token &&
                                <Text onPress={() => this.logoutUserHandler(true)}>
                                    <Icon name="md-log-out" size={20} /> Logout
                                </Text>}
                            </View>
                            <View>
                                <ButtonWithBackground color="#0099CC" onPress={() => this.props.setAddDialog(true)}>Add
                                    item
                                </ButtonWithBackground>
                            </View>
                            <View style={styles.tabs}>
                                <View style={styles.tab}>
                                    <ButtonWithBackground color="#0099CC"
                                                          onPress={() => this.onTabClickHandler('not_completed')}
                                                          disabled={this.state.selectedTab === 'not_completed'}>
                                        Not completed
                                    </ButtonWithBackground>
                                </View>
                                <View style={styles.tab}>
                                    <ButtonWithBackground color="#0099CC"
                                                          onPress={() => this.onTabClickHandler('completed')}
                                                          disabled={this.state.selectedTab === 'completed'}>
                                        Completed
                                    </ButtonWithBackground>
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
                                <Dialog.Input label="Name" style={styles.input} value={this.props.item.name}
                                              onChangeText={(text) => this.props.setItemValue('name', text)}/>
                                <Dialog.Input label="Priority (0-9)" keyboardType="numeric" style={styles.input}
                                              value={this.props.item.priority.toString()}
                                              onChangeText={(text) => this.props.setItemValue('priority', text)}/>
                                <Dialog.Switch label="Completed?" value={this.props.item.isCompleted}
                                               onValueChange={(value) => this.props.setItemValue('isCompleted', value)}/>
                                <Dialog.Button label="Cancel" onPress={this.onCancelEditClickHandler}/>
                                <Dialog.Button label="Save" onPress={this.onSaveHandler}/>
                            </Dialog.Container>
                            <Dialog.Container visible={this.props.deleteDialog}>
                                <Dialog.Title>Remove task</Dialog.Title>
                                <Dialog.Description>
                                    {deleteItemText}
                                </Dialog.Description>
                                <Dialog.Button label="Cancel" onPress={() => this.props.setDeleteDialog(false)}/>
                                <Dialog.Button label="Delete" onPress={this.deleteItemHandler}/>
                            </Dialog.Container>
                        </View>:
                        <View style={styles.login_form_container}>
                            <Text style={styles.login_header}>{this.state.newUser?'Create new account':'Login'}</Text>
                            {this.state.newUser &&
                            <View>
                                <Text>Name</Text>
                                <DefaultInput
                                    placeholder="Name"
                                    value={this.state.userName}
                                    onChangeText={(text) => this.setState({'userName': text})}
                                />
                            </View>}
                            <Text>Email</Text>
                            <DefaultInput
                                placeholder="Email"
                                value={this.state.userEmail}
                                onChangeText={(text) => this.setState({'userEmail': text})}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Text>Password</Text>
                            <DefaultInput
                                placeholder="Password"
                                value={this.state.userPassword}
                                onChangeText={(text) => this.setState({'userPassword': text})}
                                secureTextEntry={true}
                                autoCapitalize="none"
                            />
                            <View style={styles.new_user_switch}>
                                <Text style={styles.new_user_label}>
                                    {this.state.newUser?
                                        <Text>Have an account?
                                            <Text
                                                onPress={() => this.setState({'newUser': false})}
                                                style={{color: 'red'}}
                                            > Login!</Text>
                                        </Text>:
                                        <Text>New user?
                                            <Text
                                                onPress={() => this.setState({'newUser': true})}
                                                style={{color: 'red'}}
                                            > Create new account!</Text>
                                        </Text>}
                                </Text>
                                {/*<Switch value={this.state.newUser}  onValueChange={(value) => this.setState({'newUser': value})} />*/}
                            </View>
                            <ButtonWithBackground color="#0099CC"
                                                  onPress={this.loginRegisterUserHandler}
                                                  disabled={this.state.loadingLogin}>{this.state.newUser?'Create':'Login'}
                            </ButtonWithBackground>
                        </View>}
                </View>
                }
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    top_buttons: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end'
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
    },
    login_form_container: {
        padding: 15
    },
    login_header: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 30,
        marginBottom: 15
    },
    new_user_switch: {
        flexDirection: 'row',
        flex: 1
    },
    new_user_label: {
        marginRight: 15
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