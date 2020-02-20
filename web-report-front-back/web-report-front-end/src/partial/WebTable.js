import React, {Component} from 'react';
import Loading from './Loading';
import Pagination from "./Pagination";
import "../css/WebTable.scss";
import $ from 'jquery';
// props...
// Try to do the column adjusting
// call backend to do filtering
class WebTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 20,
            hover: false,
            ordering: true,
            clickTr: {rowindex: -1},

        }
    }

    updateDimensions(isOpen) {
        let headerHeight = $('.header-nav').outerHeight();
        let operationMainHeight = this.props.isOpen ? $('.operation-main').outerHeight() -$('.filter-container').outerHeight()
        : $('.operation-main').outerHeight();
        let filterHeight = isOpen ? $('.filter-container .filter-content').outerHeight() : 0;
        let paginationHeight = $('.pagination').outerHeight() || $(window).width() < 1200 ? 75: 60;
        let height = $(window).outerHeight() -
            headerHeight -
            filterHeight -
            operationMainHeight -
            paginationHeight;
        this.setState({width: $(window).width(), height});
    }

    componentDidMount() {
        this.updateDimensions(this.props.isOpen);
        window.addEventListener("resize", this.updateDimensions.bind(this, this.props.isOpen));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this, this.props.isOpen));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let queryParams = new URLSearchParams(nextProps.location.search);
        let limit = +queryParams.get("limit") || 20;
        this.setState({
            limit
        })
        if(this.props.isOpen !== nextProps.isOpen){
            this.updateDimensions(nextProps.isOpen)
        }
    }

    render() {
        return (
            <div>
                {this.props.loading ?
                    <Loading/>
                    :
                    <div className={"table-container"} style={{height: `calc(${this.state.height}px)`}}>
                        <table className={"table"}>
                            <thead>
                            <tr>
                                {this.props.headers.map((item, colindex) => (
                                    <th key={colindex}
                                        onClick={() => {
                                            if (item.sortable) {
                                                this.setState({
                                                    ordering: !this.state.ordering
                                                })

                                                let searchParams = new URLSearchParams(this.props.location.search);
                                                //let orderParams = +searchParams.get('order_by') || '';
                                                let order_by = `${this.state.ordering ? '' : '-'}${item.key}`
                                                searchParams.set('order_by', order_by);

                                                this.props.history.push({
                                                    pathname: this.props.location.pathname,
                                                    search: searchParams.toString()
                                                })
                                            }
                                        }}
                                        onMouseEnter={() =>
                                            this.onMouseEnterHandler(-1, colindex)}
                                        onMouseLeave={() =>
                                            this.onMouseLeaveHandler(-1, colindex)}
                                        className={this.isHover(colindex)}
                                        style={{position: 'relative'}}>
                                        <span className={'mr-1'}>{item.value}</span>
                                        {item.sortable &&
                                        <span>
                                    <span className={'fas fa-angle-up'}>
                                    </span>
                                    <span className={'fas fa-angle-down'}>
                                    </span>
                                        </span>}
                                    </th>))
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.items.map((item, rowindex) => (
                                <tr key={rowindex} className={this.state.clickTr.rowindex === rowindex ? 'clicked' : ''}
                                    onClick={() => {
                                        this.onTableRowClick(rowindex)
                                    }}>
                                    {item.map((data, colindex) => (
                                        <td
                                            onMouseEnter={() =>
                                                this.onMouseEnterHandler(rowindex, colindex)}
                                            onMouseLeave={() =>
                                                this.onMouseLeaveHandler(rowindex, colindex)}
                                            className={this.isHover(colindex)}
                                            key={colindex}>{data}
                                        </td>
                                    ))}
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>
                        {(this.props.items.length === 0 || this.props.headers.length === 0) &&
                        <h3 className={"no-data-header"}>
                            No Item found!
                        </h3>}
                        {this.props.items.length > 0 && this.props.headers.length > 0 &&
                        <div>
                            <Pagination {...this.props} limit={this.state.limit} totalItems={this.props.totalItems}/>
                        </div>
                        }
                    </div>}
            </div>
        );
    }

    onTableRowClick = (rowindex) => {
        this.setState({
            clickTr: {
                rowindex:
                    this.state.clickTr.rowindex !== rowindex ?
                        rowindex : -1
            }
        })
    }
    onMouseEnterHandler = (rowindex, colindex) => {
        this.setState({
            hover: true,
            hoverColIndex: colindex
        })
    }
    onMouseLeaveHandler = (rowindex, colindex) => {
        this.setState({
            hover: false,
            hoverColIndex: colindex
        })
    }
    isHover = (colIndex) => {
        return this.state.hover && this.state.hoverColIndex === colIndex ?
            'hover' : '';
    }
}

export default WebTable;
