import axios from 'axios';
import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import Loading from '../components/Loading';

class Purchase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            purchaseId: props.match.params.NumDoc,
            id: props.match.params.Id,
            value: props.match.params.DataDoc,
            supplier: props.match.params.Nome,
            date: props.match.params.DataDoc,
            info: {},
            loadingPrimaveraDetails: true,
            loadingPrimaveraDocuments: true,
        }
    }


    componentDidMount() {
        if (this.props.token !== null) {
            this.requestProductDetails()
                .then((res) => this.handleDetailsResponse(res))
                .catch(err => console.log(err));
            this.requestDocuments()
                .then((res) => this.handleDocumentsResponse(res))
                .catch(err => console.log(err));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Check if token was updated
        if (prevProps.token === null && this.props.token !== null) {
            this.requestProductDetails()
                .then((res) => this.handleDetailsResponse(res))
                .catch(err => console.log(err));
            this.requestDocuments()
                .then((res) => this.handleDocumentsResponse(res))
                .catch(err => console.log(err));
        }
    }

    requestPurchaseDetails = async () => {
        var query = JSON.stringify("SELECT Artigo,Quantidade,PrecUnit,Descricao, Quantidade * PrecUnit AS Preco  FROM LinhasCompras WHERE IdCabecCompras = '" + this.state.id + "'");

        return axios({
            method: 'post',
            url: 'http://localhost:2018/WebApi/Administrador/Consulta',
            crossdomain: true,
            headers: {
                'content-type': 'application/json',
                'authorization': "Bearer " + this.props.token
            },
            data: query
        });
    };

    handleDetailsResponse(res) {
        if (res.status === 200 && res.data.DataSet.Table.length)
            this.setState({
                info: res.data.DataSet.Table[0],
                loadingPrimaveraDetails: false
            });
    };

    loading() {
        return this.props.token === null || this.state.loadingPrimaveraDetails || this.state.loadingPrimaveraDocuments;
    }

    render() {
        if (this.loading())
            return <Loading />

        const columns = [{
            dataField: 'Artigo',
            text: 'ID',
            sort: true
        }, {

            dataField: 'Descricao',
            text: 'Product Name',
            sort: true,
            filter: textFilter({
                delay: 50,
                style: {
                    display: 'none'
                },
                placeholder: 'Search product',
                getFilter: (filter) => {
                    this.nameFilter = filter;
                }
            })
        }, {
            dataField: 'Quantidade',
            text: 'Units',
            sort: true,
            filter: textFilter({
                delay: 50,
                style: {
                    display: 'none'
                },
            })
        }, {
            dataField: 'PrecUnit',
            text: 'Price per Unit',
            sort: true,
            filter: textFilter({
                delay: 50,
                style: {
                    display: 'none'
                },
            })
        },
        {
            dataField: 'Preco',
            text: 'Price',
            sort: true
        }
        ];

        const defaultSorted = [{
            dataField: 'Descricao',
            order: 'asc'
        }];

        const customTotal = (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
                Showing {from} to {to} of {size} products
                </span>
        );

        const tableOptions = {
            hideSizePerPage: true,
            hidePageListOnlyOnePage: true,
            showTotal: true,
            paginationTotalRenderer: customTotal
        };

        const handleSearchInput = (e) => {
            this.nameFilter(e.target.value);
        };

        return (
            <div id="purchasePage" className="container">
                <div className="card">
                    <div className="card-header">
                        <strong>Purchase: </strong>{this.state.purchaseId}
                    </div>
                    <div className="card-body">
                        <div className="d-flex flex-row justify-content-around product-infos">
                            <span className="card w-25">
                                <div className="card-header">Supplier</div>
                                <div className="card-body">{this.state.supplier}</div>
                            </span>

                            <span className="card w-25">
                                <div className="card-header">Total</div>
                                <div className="card-body">{this.state.value}</div>
                            </span>

                            <span className="card w-25">
                                <div className="card-header">Date</div>
                                <div className="card-body">{this.state.date}</div>
                            </span>
                        </div>

                        <div className="card">
                            <h5 className="card-header text-center">List of Products</h5>
                            <div className="card-body">
                                <input type="text" className="form-control" placeholder="Search product" onInput={handleSearchInput} />
                                <BootstrapTable bootstrap4 striped hover keyField='PurchaseCode' data={this.state.purchases} columns={columns} defaultSorted={defaultSorted} pagination={paginationFactory(tableOptions)} filter={filterFactory()} />
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        );
    }

}

export default Purchase;
