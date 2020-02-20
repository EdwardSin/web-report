import React, {Component} from 'react';
import {CSVLink} from 'react-csv';
import '../css/OperationContainer.scss';
import MultipleDropBox from "./MultipleDropBox";
import Tippy from '@tippy.js/react'
import * as _ from 'lodash';
import ShowDisplayItemsInput from "./ShowDisplayItemsInput";

class OperationContainer extends Component {
    csvLink = React.createRef()

    constructor(props) {
        super(props);
        this.state = {
            isOpenFilterContainer: false,
            data: null
        }
    }

    render() {
        let {isOpenFilterContainer} = this.state;
        let displayColumnsAsArray = this.getDisplayColumnsAsArray();
        return (
            <div className={"operation-main"}>
                <div className={"operation-container"}>
                <div style={{ padding: '1rem 1rem 0 1rem',  zIndex: 8, position: 'relative'}}>
                    <Tippy content={"Filter"} className={"tippy"} arrow={true}>
                        <button onClick={this.openFilterContainer}
                                className={`btn btn-operation 
                        mr-3`}>
                            <span className={"fas fa-filter"}></span>
                        </button>
                    </Tippy>
                    <Tippy content={"Download"} className={"tippy"} arrow={true}>
                        <button className="btn btn-operation mr-3" onClick={() => {
                            this.props.downloadClick(this.csvLink)
                        }}>
                            <span className={"fas fa-download"}></span>
                        </button>
                    </Tippy>
                    <CSVLink ref={this.csvLink} target="_blank"
                             data={this.props.downloadData || ''}
                             filename={this.props.downloadFilename}></CSVLink>
                    <div className={'float-right'} style={{display: 'inline-block'}}>
                        <MultipleDropBox options={this.props.headers}
                                         selectedOptions={displayColumnsAsArray}
                                         isSelectionChanged={(values) => {
                                             let searchParams = new
                                             URLSearchParams(this.props.location.search);
                                             searchParams.set('display', values);
                                             this.props.history.push({
                                                 location: this.props.location.pathname,
                                                 search: searchParams.toString()
                                             })
                                         }} customPlaceholder={"Columns"}
                                         multiple/>
                    </div>
                </div>
                <div style={{position: 'relative', zIndex: 7}}>
                    {this.props.filterContainer &&
                     this.props.filterContainer(isOpenFilterContainer)}
                </div>

                <ShowDisplayItemsInput {...this.props} />
            </div>
                <div className={'operation-main-padding ' + (isOpenFilterContainer ? 'open': '')}></div>
            </div>
        );
    }

    getDisplayColumnsAsArray = () => {
        let queryParams = new URLSearchParams(this.props.location.search);
        let display_columns = queryParams.get('display');
        display_columns = display_columns != null ? display_columns :
            this.props.headers.map(x => {
                return x.value + ","
            });
        return _.split(display_columns, ',').filter(x => x !== "");
    };
    openFilterContainer = () => {
        this.props.onFilterClicked(!this.state.isOpenFilterContainer);
        this.setState({
            isOpenFilterContainer: !this.state.isOpenFilterContainer
        })
    }
}

export default OperationContainer;
