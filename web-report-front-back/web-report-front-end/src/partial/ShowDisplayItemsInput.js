import React, { Component } from 'react';

class ShowDisplayItemsInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            value: props.limit || 20,
            limit: 20,
            page: 1
        }

    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        let queryParams = new URLSearchParams(nextProps.location.search);
        let limit = +queryParams.get("limit") || 20;
        let page = +queryParams.get('page') || 1;
        this.setState({
            limit,
            page
        })
    }

    render() {
        return (
            <div style={{paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1rem'}}>
                <p className={'mb-0'}>Show <select onChange={this.change.bind(this)}
                    value={this.state.limit}>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
                </select> items every page.
                    <span style={{display: 'inline-block', float: 'right'}}>
                        { this.props.totalItems || 0 } items found</span>
                </p>
                <p className={'mb-0'} style={{ paddingTop: '1rem'}}>
                    <span>{this.state.limit * (this.state.page - 1) + 1}</span>
                    <span> - </span>
                    <span>{ Math.min(this.state.limit * this.state.page,
                        this.props.totalItems)} items</span>
                </p>
            </div>
        )
    }
    change(event){
        this.setState({ limit: event.target.value }, () => {
            let searchParams = new URLSearchParams(this.props.location.search);
            searchParams.set('limit', this.state.limit);
            searchParams.set('page', '1');
            this.props.history.push({
                location: this.props.location.pathname,
                search: searchParams.toString() })
        });
    }
}

export default ShowDisplayItemsInput;
