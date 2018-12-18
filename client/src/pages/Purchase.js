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
            id: props.match.params.id,
            info: {},
            loadingPrimaveraDetails: true,
        }
    }

    componentDidMount() {
        if (this.props.token !== null) {
            this.requestPurchaseDetails()
              .then((res) => this.handleDetailsResponse(res))
              .catch(err => console.log(err));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Check if token was updated
        if( prevProps.token === null && this.props.token !== null ) {
          this.requestPurchaseDetails()
            .then((res) => this.handleDetailsResponse(res))
            .catch(err => console.log(err));
        }
    }

    requestPurchaseDetails = async () => {
        var filial = this.state.id.split('/')[0];
        var tipoDoc =this.state.id.split('/')[1];
        var serie= this.state.id.split('/')[2];
        var numDoc=this.state.id.split('/')[3];
        var query = JSON.stringify("SELECT Abs(CabecCompras.TotalMerc) AS TotalMerc, CabecCompras.Nome, CONVERT(Varchar(10),CabecCompras.DataDoc,103) AS DataDoc, LinhasCompras.Artigo,Abs(LinhasCompras.Quantidade) AS Quantidade,Abs(LinhasCompras.PrecUnit) AS PrecUnit,LinhasCompras.Descricao,Quantidade * PrecUnit AS Preco FROM CabecCompras INNER JOIN LinhasCompras ON CabecCompras.Id = LinhasCompras.IdCabecCompras WHERE Filial='" + filial +"' AND Serie='"+ serie +"' AND TipoDoc='"+ tipoDoc +"' AND NumDoc='"+ numDoc +"'");
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
                prod: res.data.DataSet.Table,
                loadingPrimaveraDetails: false
            });
    };

    loading() {
        return this.props.token === null || this.state.loadingPrimaveraDetails;
    }

    render() {
        if (this.loading())
            return <Loading />

        const columns = [{
            dataField: 'Artigo',
            text: 'ID',
        }, {

            dataField: 'Descricao',
            text: 'Product Name',
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
            filter: textFilter({
                delay: 50,
                style: {
                    display: 'none'
                },
            })
        }, {
            dataField: 'PrecUnit',
            text: 'Price per Unit',
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
        }
        ];

        const defaultSorted = [{
            dataField: 'PrecUnit',
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
                        <strong>Purchase: </strong>{this.state.id}
                    </div>
                    <div className="card-body">
                        <div className="d-flex flex-row justify-content-around product-infos">
                            <span className="card w-25">
                                <div className="card-header text-center">Supplier</div>
                                <div className="card-body text-center">{this.state.info.Nome}</div>
                            </span>

                            <span className="card w-25">
                                <div className="card-header text-center">Total</div>
                                <div className="card-body text-center">{this.state.info.TotalMerc} €</div>
                            </span>

                            <span className="card w-25">
                                <div className="card-header text-center">Date</div>
                                <div className="card-body text-center">{this.state.info.DataDoc}</div>
                            </span>
                        </div>

                        <div className="card purchaseOverview">
                            <h5 className="card-header text-center">List of Products</h5>
                            <div className="card-body">
                                <input type="text" className="form-control" placeholder="Search product" onInput={handleSearchInput} />
                                <BootstrapTable bootstrap4 striped hover keyField='PurchaseCode' data={this.state.prod} columns={columns} defaultSorted={defaultSorted} pagination={paginationFactory(tableOptions)} filter={filterFactory()} />
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        );
    }

}

export default Purchase;
