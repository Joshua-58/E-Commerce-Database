import React, { Component } from 'react';
import axios from 'axios';
import Product from './Product';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      error: null,
    };
  }

  componentDidMount() {
    this.fetchProducts(); // Fetch products initially

    // Set up an interval to fetch products every 5 minutes (adjust the interval as needed)
    this.interval = setInterval(() => {
      this.fetchProducts();
    }, 900000); // 5 minutes in milliseconds
  }

  componentWillUnmount() {
    // Clear the interval when the component is unmounted to prevent memory leaks
    clearInterval(this.interval);
  }

  fetchProducts() {
    axios.get('https://marketzone-api.vercel.app/marketzone/api/products')
      .then((response) => {
        this.setState({ products: response.data.data });
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        this.setState({ error: 'Failed to fetch products. Please try again later.' });
      });
  }

  render() {
    const { products, error } = this.state;

    // Check for the error state
    if (error) {
      return <div>{error}</div>;
    }

    // Check if products is an array before mapping
    if (!Array.isArray(products)) {
      // Handle the error condition
      return <div>Error fetching products. Please try again later.</div>;
    }

    return (
      <div>
        {products.map((product) => (
          <Product
            key={product.id}
            product={product}
            onAddToCartNotification={this.props.onAddToCartNotification}
          />
        ))}
      </div>
    );
  }
}

export default ProductList;
