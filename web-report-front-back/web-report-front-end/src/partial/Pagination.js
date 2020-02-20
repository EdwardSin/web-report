import React, {Component} from 'react';
import {Link} from "react-router-dom";
import "../css/Pagination.scss";

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            currentPage: 1,
            totalItems: 100
        };
    }

    componentDidMount() {
        let queryParams = new URLSearchParams(this.props.location.search);
        let limit = +queryParams.get("limit") || 20;
        this.getPages(this.props.totalItems, limit);
        this.unlisten = this.props.history.listen((location, action) => {
            let queryParams = new URLSearchParams(location.search);
            let limit = +queryParams.get("limit") || 20;
            this.getPages(this.props.totalItems, limit);
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        let queryParams = new URLSearchParams(this.props.location.search);
        let selected = +queryParams.get('page') || 1;
        let totalPageArray = this.state.totalPages ? [...Array(this.state.totalPages).keys()] : [1];
        return (
            <div>
                <div className={"center pagination"}>
                    <ul className={"nav navbar-nav"}>
                        {selected > 1 &&
                        <li className={"nav-item"}>
                            <Link to={this.navigateToPreviousPage()}>
                                <span className={"fas fa-chevron-left"}></span>
                            </Link>
                        </li>
                        }
                        <li className={`nav-item ${this.isSelected(1, selected)}`}>
                            <Link to={this.navigateTo(0)}>{1}</Link>
                        </li>
                        {
                            selected > 3 &&
                            <li className={"nav-item"}>
                                <span className={"ellipsis"}>...</span>
                            </li>
                        }
                        {totalPageArray.map((item, index) => {

                            return (
                                index > 0 && (index === selected || selected - 2 === index || selected - 1 === index)
                                && (index < totalPageArray.length - 1) &&
                                <li key={index} className={`nav-item ${this.isSelected(index + 1, selected)}`}>
                                    <Link to={this.navigateTo(index)}>{index + 1}</Link>
                                </li>
                            )
                        })}
                        {
                            selected < totalPageArray.length - 2 &&
                            <li className={"nav-item"}>
                                <span className={"ellipsis"}>...</span>
                            </li>
                        }
                        { totalPageArray.length > 1 && <li className={`nav-item ${this.isSelected(totalPageArray.length, selected)}`}>
                            <Link to={this.navigateTo(totalPageArray.length - 1)}>{totalPageArray.length}</Link>
                        </li>}
                        {selected < totalPageArray.length &&
                        <li className={"nav-item"}>
                            <Link to={this.navigateToNextPage(totalPageArray)}>
                                <span className={"fas fa-chevron-right"}></span>
                            </Link>
                        </li>
                        }
                    </ul>
                </div>
            </div>
        );
    }

    isSelected(page, currentPage) {
        return currentPage === page ? 'selected' : '';
    }

    navigateToPreviousPage() {
        let currentPathName = this.props.location.pathname;
        let searchParams = new URLSearchParams(this.props.location.search);
        let selected = +searchParams.get('page') || 1;
        searchParams.set('page', Math.max(selected - 1, 1));
        return {pathname: currentPathName, search: searchParams.toString()}
    }

    navigateToNextPage(totalPageArray) {
        let currentPathName = this.props.location.pathname;
        let searchParams = new URLSearchParams(this.props.location.search);
        let selected = +searchParams.get('page') || 1;
        searchParams.set('page', Math.min(1 + selected, totalPageArray.length));
        return {pathname: currentPathName, search: searchParams.toString()}
    }

    navigateTo(index) {
        let currentPathName = this.props.location.pathname;
        let searchParams = new URLSearchParams(this.props.location.search);
        searchParams.set('page', index + 1);
        return {pathname: currentPathName, search: searchParams.toString()};
    }

    getPages(totalItems = 20, limit = 20) {
        let _total = Math.floor(totalItems / limit);
        let totalPages = totalItems % limit === 0 ? _total : _total + 1;
        this.setState({
            totalPages: totalPages || 1
        });
    }
}

export default Pagination;
