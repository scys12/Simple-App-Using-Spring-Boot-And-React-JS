import React, { Component } from 'react'
import { Container, Card, Row, Button, Alert} from 'react-bootstrap';
import UserService from './UserService';
import AuthService from './AuthService';
import Pagination from "react-js-pagination";
import SweetAlert from 'react-bootstrap-sweetalert';

class UserItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading : true,
            Items : [],
            message: '',
            type: '',
            visible: false,
            user: AuthService.getCurrentUser(),
            articlesDetails: [],
            activePage:1,
            totalPages: null,
            itemsCountPerPage:null,
            totalItemsCount:null,
            showAlert: false,
            success : false,
            showAlertNotification : true
        };
    }

    showDeleteAlert(e){
        e.preventDefault();
        this.setState({
            showAlert: true
        });
    }

    onCancel(e){
        this.setState({
            showAlert : false
        });
    }
    
    fetchUrl(page){
        UserService.getUserItems(this.state.user.id, (page-1)).then(
            response =>{
                this.setState({
                    totalPages : response.data.totalPages,
                    itemsCountPerPage : response.data.size,
                    totalItemsCount : response.data.totalElements,
                    isLoading : false,
                    Items : response.data.content
                });
            },
            error =>{
                console.log(error);
            }        
        )
    }

    handlePageChange(pageNumber) {
        this.setState({
            activePage: pageNumber
        })
        this.fetchUrl(pageNumber)
    }

    componentDidMount(){
        if (typeof this.props.location.state != "undefined") {
            this.setState({message:this.props.location.state.message, type:this.props.location.state.type})
            setTimeout(() => {
                this.setState({
                    showAlertNotification:false,
                    message : ''
                })
                this.props.history.push({
                    pathname: "/user/item",
                    state: {
                        message: "",
                        type: ""
                    }
                });
            }, 2000);
        }        
        this.fetchUrl(this.state.activePage);
    }
    deleteItem(id){
        UserService.deleteProduct(id).then(
            response => {
                this.setState({success : true});
                this.props.history.push({
                    pathname: "/user/item",
                    state: {
                        message: "Produk berhasil dihapus",
                        type: "danger"
                    }
                });
                window.location.reload();
            },
            error => {
                console.log(error)
            }
        )
        this.setState({
            showAlert: false
        });
    }
      
    render() { 
        const isLoading = this.state.isLoading;
        const itemContent = this.state.Items;
        const totalPages = this.state.totalPages;

        if (isLoading) {
            return (<div>
                Loading...
                </div>
            );
        }        console.log(itemContent)
        return (
            <Container>
                {(this.state.message && this.state.showAlertNotification) &&( 
                    <Alert key="1" variant={this.state.type}>
                        {this.state.message}
                    </Alert>
                )}
                <Card className="card-home">
                    <Card.Header>
                        <p className="produk-header">Produk</p>
                        <Button variant="success" style={{float: "right"}} href="/user/item/tambah">Tambah Produk</Button>
                    </Card.Header>
                    <Card.Body>
                    <Row className="show-grid text-center">
                            {itemContent.map(item =>
                                <div key={item.id} className="item-wrapper">
                                    <Card>
                                        <div className={item.isBought === 1 ? 'item-card-img text-center' : 'text-center'}>{item.isBought === 1 && <div className="item-bought">Laku</div>}<Card.Img variant="top" src={`http://localhost:3000/images/${item.category.name}.png`} className="item-img" /></div>
                                        <Card.Body>
                                            <Card.Title><strong>{item.name}</strong></Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">[{item.category.name}]</Card.Subtitle>
                                            <hr/>
                                            <Card.Text>
                                                {item.description}
                                            </Card.Text>
                                            <hr/>
                                            {(item.isBought === 0) &&
                                                <>
                                                    <Button href={`/user/item/${item.id}`} className="produk-button" variant="primary">Lihat Produk</Button>
                                                    <Button href={`/user/item/edit/${item.id}`} className="produk-button" variant="warning">Edit Produk</Button>
                                                    <Button onClick={this.showDeleteAlert.bind(this)} className="produk-button" variant="danger">Hapus Produk</Button>
                                                    <SweetAlert  show={this.state.showAlert} warning showCancel confirmBtnText="Ya, Hapus!" confirmBtnBsStyle="danger" title="Apa kamu yakin menghapus produk ini?" onConfirm={() => this.deleteItem(item.id)}
                                                        onCancel={this.onCancel.bind(this)} focusCancelBtn cancelBtnText="Tidak">
                                                        Kamu harus menambahkan ulang produk ini jika ingin menjualnya lagi !
                                                    </SweetAlert>
                                                </>
                                            }
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                    </Row>
                    </Card.Body>
                </Card>
                {totalPages > 1 && (
                    <div className="d-flex flex-row py-4 justify-content-center">
                        <Pagination hideNavigation                        
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.itemsCountPerPage}
                            totalItemsCount={this.state.totalItemsCount}
                            pageRangeDisplayed={10}
                            
                            itemClass='page-item'
                            linkClass='btn btn-light'
                            onChange={this.handlePageChange.bind(this)}
                        />
                    </div>
                )}
            </Container>
        );
    }
}
 
export default UserItem;