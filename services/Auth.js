import React, { createContext } from "react";

export const AuthContext = createContext();

export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: true,
      isAdmin: true,
      isUser: false,
      user: null,
    };
  }

  // componentDidMount() {
  //   let user = JSON.parse(localStorage.getItem("user"));
  //   let token = localStorage.getItem("token");
  //   let expiryDate = localStorage.getItem("expiryDate");
  //   if (user && token && expiryDate) {
  //     expiryDate = Number(localStorage.getItem("expiryDate")) * 1000;
  //     if (expiryDate > new Date().getTime()) {
  //       if (user.role === "admin") {
  //         this.setState({ isAuth: true, isAdmin: true, user: user });
  //       } else {
  //         this.setState({ isAuth: true, isUser: true, user: user });
  //       }
  //     }
  //   }
  // }

  render() {
    return (
      <AuthContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
