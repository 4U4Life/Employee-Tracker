import { registerUser } from '../../services/authService.js'
import React from 'react';
import {Button, Form, FormGroup, Label, Input, FormFeedback, Alert} from 'reactstrap';
import { Container } from "reactstrap";
import { Link, Redirect } from 'react-router-dom';
import TextInput from '../common/Input'


export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                username: '',
                email: '',
                password: '',
                password2: '',
                isStaff: false,
            },
            errors: {},
            registrationFinished: false
        };
    }

    handleInputChange = event => {
        const target = event.target;
        const name = target.name;

        this.setState({
            data: { ...this.state.data, [name]: target.value},
            errors: {...this.state.errors, [name]: undefined},
        });
    };

    handleIsStaffChange = event => {
        this.setState({
            isStaff: !this.state.data.isStaff,
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        registerUser(this.state.data).then((res) => {
            this.setState({
                registrationFinished: true
            });

        }).catch((error) => {
            console.log(error.response.data);

            switch (error.response.status) {
                case 400: {
                    const fieldErrors = error.response.data;
                    Object.keys(fieldErrors).map((fieldName) => {
                        fieldErrors[fieldName] = fieldErrors[fieldName].join(" ");
                        console.log(fieldErrors[fieldName])
                    });

                    this.setState({
                        errors: fieldErrors
                    });
                    break;
                }
                case 401: {
                    window.location.replace("/login");
                    break;
                }
                default: {
                    console.log("Unexpected error occurred. ", error);
                }
            }
        });
    };

    render() {
        const { errors, registrationFinished } = this.state;

        if (registrationFinished) {
            alert('You are almost there! Check out your email to complete registration.');
            return <Redirect to="/login"/>
        }
        return (
            <React.Fragment>
                <Container className="col-8" style={{margin: "auto"}}>
                    <h1>Account Sign Up</h1>
                    <p>
                        Use the form below to sign in to your online account.
                        Please enter your information exactly as given to you.
                        If you are having trouble please use the 'forgot username/password'
                        link or <Link to = "/contact">contact our staff</Link> for assistance.
                    </p>
                </Container>
                <Form className="auth-form" autoComplete="on">
                    <TextInput
                        name="username"
                        labelText="Username"
                        error={errors.username}
                        onInputChange={this.handleInputChange}
                    />
                    <TextInput
                        name="email"
                        labelText="Email"
                        error={errors.email}
                        onInputChange={this.handleInputChange}
                    />
                    <TextInput
                        name="password"
                        labelText="Password"
                        error={errors.password}
                        onInputChange={this.handleInputChange}
                        type="password"
                    />
                    <TextInput
                        name="password2"
                        labelText="Confirm password"
                        error={errors.password2}
                        onInputChange={this.handleInputChange}
                        type="password"
                    />
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" onChange={this.handleIsStaffChange}/>{' '}
                            I'd like to create a manager account
                        </Label>
                    </FormGroup>
                    <FormGroup>
                        <Alert color="danger" isOpen={errors.non_field_errors !== undefined}>
                            {errors.non_field_errors}
                        </Alert>
                    </FormGroup>
                    <FormGroup className="auth-other">
                        <Button onClick={(event) => this.handleSubmit(event)}>Submit</Button>
                    </FormGroup>
                </Form>
            </React.Fragment>
        );
    }
}