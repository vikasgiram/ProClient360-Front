import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ProClient360 = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to handle smooth scrolling
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading ProClient360...</p>
      </div>
    );
  }

  return (
    <div className="main-page-wrapper p0 font-gordita">
      <style>
        {`
          /* ProClient360 - Complete CSS Styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          :root {
            --primary-color: #6D49FF;
            --primary-light: #8B5CF6;
            --secondary-color: #FF4A8B;
            --accent-color: #FFB951;
            --text-dark: #1a1a1a;
            --text-gray: #666;
            --text-light: #999;
            --bg-light: #f8f9ff;
            --white: #ffffff;
            --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text-dark);
            background-color: var(--white);
            font-weight: 400;
          }

          .font-gordita {
            font-family: 'Inter', sans-serif;
          }

          .p0 {
            padding: 0;
          }

          /* Container Utilities */
          .lg-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
          }

          /* Header & Navigation */
          .theme-main-menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 999;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            padding: 15px 0;
          }

          .theme-main-menu.sticky-menu {
            box-shadow: var(--shadow);
          }

          .theme-main-menu .container {
            max-width: 1200px;
          }

          .logo img {
            height: 45px;
            width: auto;
            transition: transform 0.3s ease;
          }

          .logo:hover img {
            transform: scale(1.05);
          }

          .logo_size {
            max-height: 45px;
            width: auto;
          }

          /* Navigation Menu */
          .navbar-nav {
            display: flex;
            align-items: center;
            gap: 35px;
          }

          .nav-link {
            color: var(--text-dark) !important;
            font-weight: 500;
            font-size: 16px;
            text-decoration: none;
            transition: all 0.3s ease;
            padding: 8px 0 !important;
            position: relative;
          }

          .nav-link:hover {
            color: var(--primary-color) !important;
            transform: translateY(-1px);
          }

          .nav-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 50%;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            transition: all 0.3s ease;
            transform: translateX(-50%);
          }

          .nav-link:hover::after {
            width: 100%;
          }

          /* Login Button */
          .signup-btn {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: white !important;
            padding: 12px 28px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(109, 73, 255, 0.3);
            border: none;
            cursor: pointer;
          }

          .signup-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(109, 73, 255, 0.4);
            color: white !important;
          }

          /* Mobile Menu Toggle */
          .navbar-toggler {
            border: none;
            background: none;
            padding: 8px 12px;
            cursor: pointer;
          }

          .navbar-toggler span {
            display: block;
            width: 25px;
            height: 3px;
            background: var(--text-dark);
            margin: 4px 0;
            transition: 0.3s;
            border-radius: 2px;
          }

          /* Hero Section */
          .hero-banner-nine {
            padding-top: 140px;
            padding-bottom: 100px;
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, var(--bg-light) 0%, var(--white) 100%);
            min-height: 100vh;
          }

          .hero-banner-nine .container {
            position: relative;
            z-index: 2;
          }

          .illustration-container {
            position: absolute;
            top: -50px;
            right: -100px;
            z-index: 1;
            opacity: 0.15;
          }

          .imgbg {
            max-width: 600px;
            height: auto;
          }

          .hero-heading {
            font-size: 4rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 24px;
            color: var(--text-dark);
            letter-spacing: -0.02em;
          }

          .hero-heading span {
            position: relative;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .hero-heading img {
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 100%;
            height: auto;
            opacity: 0.8;
          }

          .hero-sub-heading {
            font-size: 1.25rem;
            color: var(--text-gray);
            margin-bottom: 40px;
            max-width: 500px;
            line-height: 1.6;
          }

          /* Search Form */
          .hero-banner-nine form {
            display: flex;
            background: white;
            border-radius: 60px;
            padding: 10px;
            box-shadow: var(--shadow);
            margin-bottom: 24px;
            max-width: 450px;
            transition: all 0.3s ease;
          }

          .hero-banner-nine form:hover {
            box-shadow: var(--shadow-hover);
          }

          .hero-banner-nine input[type="email"] {
            flex: 1;
            border: none;
            padding: 18px 24px;
            font-size: 16px;
            outline: none;
            background: transparent;
            color: var(--text-dark);
            font-weight: 500;
          }

          .hero-banner-nine input[type="email"]::placeholder {
            color: var(--text-light);
          }

          .hero-banner-nine button {
            width: 56px;
            height: 56px;
            border: none;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .hero-banner-nine button:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(109, 73, 255, 0.4);
          }

          .hero-banner-nine button img {
            width: 20px;
            height: 20px;
            filter: brightness(0) invert(1);
          }

          .term-text {
            color: var(--text-gray);
            font-size: 14px;
            font-weight: 400;
          }

          .term-text a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
            font-weight: 600;
          }

          .term-text a:hover {
            color: var(--primary-light);
          }

          /* Background Shapes */
          .shapes {
            position: absolute;
            z-index: 1;
            pointer-events: none;
          }

          .bg-shape {
            top: 0;
            right: 0;
            opacity: 0.1;
          }

          /* Partner Slider */
          .partner-slider-two {
            margin-top: 120px;
            text-align: center;
          }

          .partner-slider-two p {
            font-size: 1.1rem;
            color: var(--text-gray);
            margin-bottom: 50px;
            font-weight: 500;
          }

          .partner-slider-two span {
            color: var(--primary-color);
            font-weight: 700;
            font-size: 1.3rem;
          }

          .partnerSliderTwo {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 50px;
            flex-wrap: wrap;
            padding: 20px 0;
          }

          .partnerSliderTwo .item {
            opacity: 0.6;
            transition: all 0.3s ease;
            padding: 15px;
          }

          .partnerSliderTwo .item:hover {
            opacity: 1;
            transform: translateY(-5px);
          }

          .partnerSliderTwo img {
            max-height: 60px;
            width: auto;
            filter: grayscale(100%);
            transition: filter 0.3s ease;
          }

          .partnerSliderTwo .item:hover img {
            filter: grayscale(0%);
          }

          /* Feature Sections */
          .fancy-feature-twentyTwo {
            padding: 120px 0;
            background: var(--white);
          }

          .title-style-eight h2 {
            font-size: 2.8rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 24px;
            line-height: 1.2;
            letter-spacing: -0.02em;
          }

          .title-style-eight h2 span {
            position: relative;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .block-style-twentyTwo {
            text-align: center;
            padding: 50px 30px;
            border-radius: 24px;
            transition: all 0.3s ease;
            height: 100%;
            background: var(--white);
            border: 1px solid rgba(0, 0, 0, 0.05);
          }

          .block-style-twentyTwo:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-hover);
            border-color: transparent;
            background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
          }

          .block-style-twentyTwo .icon {
            width: 90px;
            height: 90px;
            margin: 0 auto 30px;
            border-radius: 24px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .block-style-twentyTwo:hover .icon {
            transform: scale(1.1);
          }

          .block-style-twentyTwo h4 {
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 16px;
            color: var(--text-dark);
          }

          .block-style-twentyTwo p {
            color: var(--text-gray);
            line-height: 1.6;
            font-size: 1rem;
          }

          /* Feature Twenty Three */
          .fancy-feature-twentyThree {
            padding: 120px 0;
            background: var(--bg-light);
          }

          .title-style-nine {
            text-align: center;
            margin-bottom: 100px;
          }

          .title-style-nine h6 {
            color: var(--primary-color);
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 16px;
          }

          .title-style-nine h2 {
            font-size: 2.8rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 24px;
            line-height: 1.2;
            letter-spacing: -0.02em;
          }

          .title-style-nine h2 span {
            position: relative;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .title-style-nine p {
            font-size: 1.2rem;
            color: var(--text-gray);
            max-width: 650px;
            margin: 0 auto;
            line-height: 1.6;
          }

          /* Feature Blocks */
          .block-style-twentyThree {
            margin-bottom: 120px;
          }

          .screen-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 450px;
          }

          .oval-shape {
            position: absolute;
            width: 250px;
            height: 250px;
            border-radius: 50%;
            opacity: 0.7;
            filter: blur(1px);
          }

          .oval-shape:first-child {
            top: -20px;
            left: -20px;
          }

          .oval-shape:last-child {
            bottom: -20px;
            right: -20px;
          }

          .screen-container img {
            max-width: 90%;
            height: auto;
            border-radius: 20px;
            box-shadow: var(--shadow-hover);
            z-index: 2;
            position: relative;
            transition: transform 0.3s ease;
          }

          .screen-container:hover img {
            transform: scale(1.02);
          }

          .text-wrapper {
            padding: 60px 0;
          }

          .text-wrapper h6 {
            color: var(--primary-color);
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 16px;
          }

          .text-wrapper .title {
            font-size: 2.2rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 24px;
            line-height: 1.2;
            letter-spacing: -0.01em;
          }

          .text-wrapper p {
            font-size: 1.1rem;
            color: var(--text-gray);
            line-height: 1.7;
          }

          /* Service Industries */
          .fancy-feature-twentyFour {
            padding: 120px 0;
            background: var(--white);
          }

          .bg-wrapper {
            background: linear-gradient(135deg, var(--text-dark) 0%, #2d2d2d 100%);
            padding: 100px 0;
            position: relative;
            border-radius: 40px;
            margin-top: 80px;
            overflow: hidden;
          }

          .click-scroll-button {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 60px;
            background: var(--white);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
            text-decoration: none;
          }

          .click-scroll-button:hover {
            transform: translateX(-50%) translateY(-8px);
            box-shadow: var(--shadow-hover);
          }

          .block-style-twentyFour {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            padding: 40px;
            transition: all 0.3s ease;
            height: 100%;
          }

          .block-style-twentyFour:hover {
            transform: translateY(-8px);
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }

          .block-style-twentyFour .icon {
            width: 70px;
            height: 70px;
            border-radius: 18px;
            margin-right: 24px;
            flex-shrink: 0;
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .block-style-twentyFour:hover .icon {
            transform: scale(1.1);
          }

          .block-style-twentyFour h4 {
            color: var(--white);
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 12px;
          }

          .block-style-twentyFour p {
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            line-height: 1.6;
            font-size: 1rem;
          }

          /* Client Feedback */
          .client-feedback-slider-six {
            padding: 120px 0;
            background: var(--bg-light);
          }

          .inner-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
            position: relative;
          }

          .clientSliderSix {
            display: flex;
            gap: 40px;
            overflow-x: auto;
            padding: 40px 0;
            margin-top: 80px;
            scroll-behavior: smooth;
          }

          .clientSliderSix::-webkit-scrollbar {
            height: 8px;
          }

          .clientSliderSix::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
          }

          .clientSliderSix::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 4px;
          }

          .clientSliderSix .item {
            min-width: 380px;
            flex-shrink: 0;
          }

          .feedback-wrapper {
            background: var(--white);
            padding: 50px 40px;
            border-radius: 24px;
            box-shadow: var(--shadow);
            position: relative;
            transition: all 0.3s ease;
          }

          .feedback-wrapper:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-hover);
          }

          .ribbon {
            position: absolute;
            top: 0;
            left: 40px;
            width: 5px;
            height: 80px;
            border-radius: 3px;
          }

          .feedback-wrapper p {
            font-size: 1.1rem;
            line-height: 1.7;
            color: var(--text-dark);
            margin-bottom: 40px;
            font-style: italic;
            font-weight: 500;
          }

          .avatar-circle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-right: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
          }

          .name {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-dark);
            margin: 0;
          }

          .name span {
            font-weight: 400;
            color: var(--text-gray);
            font-size: 1rem;
          }

          /* Partners Section */
          .partner-section-one {
            padding: 120px 0;
            background: var(--white);
          }

          .img-box {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
            margin-bottom: 40px;
            transition: all 0.3s ease;
            border-radius: 16px;
          }

          .img-box img {
            max-height: 80px;
            width: auto;
            filter: grayscale(100%);
            opacity: 0.6;
            transition: all 0.3s ease;
          }

          .img-box:hover {
            background: rgba(109, 73, 255, 0.05);
          }

          .img-box:hover img {
            filter: grayscale(0%);
            opacity: 1;
            transform: scale(1.1);
          }

          /* Call to Action */
          .fancy-short-banner-ten {
            padding: 120px 0;
            text-align: center;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: var(--white);
            position: relative;
            overflow: hidden;
          }

          .fancy-short-banner-ten h2 {
            font-size: 3.2rem;
            font-weight: 700;
            margin-bottom: 24px;
            letter-spacing: -0.02em;
          }

          .fancy-short-banner-ten p {
            font-size: 1.2rem;
            margin-bottom: 50px;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }

          .download-btn .dropdown-toggle {
            background: var(--white);
            color: var(--primary-color);
            border: none;
            padding: 18px 36px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .download-btn .dropdown-toggle:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(255, 255, 255, 0.3);
          }

          .info-text {
            margin-top: 24px;
            opacity: 0.8;
            font-size: 14px;
          }

          /* Footer */
          .theme-footer-eight {
            background: var(--text-dark);
            color: var(--white);
            padding-top: 100px;
          }

          .top-footer {
            padding-bottom: 60px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          }

          .footer-about-widget {
            line-height: 1.7;
          }

          .footer-about-widget .logo {
            margin-bottom: 30px;
          }

          .footer-about-widget b {
            color: var(--white);
            font-weight: 600;
            display: block;
            margin: 20px 0 10px 0;
          }

          .footer-about-widget ul {
            list-style: none;
            padding: 0;
            margin-top: 20px;
          }

          .footer-about-widget ul li {
            margin-bottom: 12px;
          }

          .footer-about-widget ul li a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: color 0.3s ease;
            font-weight: 500;
          }

          .footer-about-widget ul li a:hover {
            color: var(--primary-light);
          }

          .footer-title {
            color: var(--white);
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 30px;
          }

          .footer-list ul {
            list-style: none;
            padding: 0;
          }

          .footer-list ul li {
            margin-bottom: 14px;
          }

          .footer-list ul li a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 400;
          }

          .footer-list ul li a:hover {
            color: var(--primary-light);
            padding-left: 5px;
          }

          .bottom-footer {
            padding: 40px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
          }

          .social-icon {
            list-style: none;
            padding: 0;
            display: flex;
            gap: 20px;
          }

          .social-icon li a {
            width: 45px;
            height: 45px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 18px;
          }

          .social-icon li a:hover {
            background: var(--primary-color);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(109, 73, 255, 0.4);
          }

          .copyright {
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            font-weight: 400;
          }

          /* Scroll to Top Button */
          .scroll-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 55px;
            height: 55px;
            background: var(--primary-color);
            border: none;
            border-radius: 50%;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: var(--shadow);
          }

          .scroll-top:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-hover);
          }

          /* Loading Screen */
          .loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: var(--bg-light);
          }

          /* Sign In Form Modal */
          .signin-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
          }

          .signin-form {
            background: white;
            border-radius: 12px;
            padding: 30px;
            width: 100%;
            max-width: 400px;
            position: relative;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }

          .close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
          }

          .close-btn:hover {
            color: #333;
          }

          .form-title {
            text-align: center;
            margin-bottom: 20px;
            color: var(--text-dark);
            font-weight: 600;
          }

          .form-input {
            width: 100%;
            padding: 12px 15px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
          }

          .form-input:focus {
            outline: none;
            border-color: var(--primary-color);
          }

          .form-textarea {
            width: 100%;
            padding: 12px 15px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            min-height: 100px;
            resize: vertical;
          }

          .form-textarea:focus {
            outline: none;
            border-color: var(--primary-color);
          }

          .form-submit {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .form-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(109, 73, 255, 0.4);
          }

          /* Responsive Design */
          @media (max-width: 1200px) {
            .hero-heading {
              font-size: 3.5rem;
            }
          }

          @media (max-width: 992px) {
            .hero-heading {
              font-size: 3rem;
            }
            
            .navbar-nav {
              gap: 20px;
            }
            
            .illustration-container {
              display: none;
            }
          }

          @media (max-width: 768px) {
            .hero-heading {
              font-size: 2.5rem;
            }
            
            .hero-sub-heading {
              font-size: 1.1rem;
            }
            
            .title-style-eight h2,
            .title-style-nine h2 {
              font-size: 2.2rem;
            }
            
            .block-style-twentyTwo {
              padding: 30px 20px;
            }
            
            .text-wrapper .title {
              font-size: 1.8rem;
            }
          }

          @media (max-width: 576px) {
            .hero-heading {
              font-size: 2rem;
            }
            
            .hero-banner-nine form {
              flex-direction: column;
              border-radius: 20px;
              padding: 20px;
            }
            
            .hero-banner-nine input[type="email"] {
              margin-bottom: 15px;
              border-radius: 15px;
            }
            
            .partnerSliderTwo {
              gap: 30px;
            }
            
            .partnerSliderTwo img {
              max-height: 40px;
            }
          }
        `}
      </style>

      {/* Theme Main Menu */}
      <div className="theme-main-menu sticky-menu theme-menu-six bg-none">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div className="logo">
              <a href="/" className="d-flex align-items-center text-decoration-none">
                <img src={`${process.env.PUBLIC_URL}/images/Black_logo.png`} className="logo_size" alt="Company Logo" />
              </a>
            </div>

            <nav className="navbar navbar-expand-lg">
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); handleScrollTo('home'); }}>Home</a>
                  </li>
                  <li className="nav-item">
                    <a href="#feature" className="nav-link" onClick={(e) => { e.preventDefault(); handleScrollTo('feature'); }}>Features</a>
                  </li>
                  <li className="nav-item">
                    <a href="#service" className="nav-link" onClick={(e) => { e.preventDefault(); handleScrollTo('service'); }}>Services</a>
                  </li>
                  <li className="nav-item">
                    <a href="#feedback" className="nav-link" onClick={(e) => { e.preventDefault(); handleScrollTo('feedback'); }}>Feedback</a>
                  </li>
                </ul>
              </div>
            </nav>
            
            <a href="https://proclient360.com/" className="signup-btn">
              Login
            </a>
          </div>
        </div>
      </div>

      {/* Theme Hero Banner */}
      <div className="hero-banner-nine lg-container-fluid" id="home">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-heading">
                Streamlined <span>Project</span> Planning for All.
              </h1>
              <p className="hero-sub-heading">
                ProClient360 is your hub for efficient workflow management and on-time project delivery.
              </p>
              <form>
                <input type="email" placeholder="info@dacces.co" />
                <button
                  className="d-flex justify-content-center align-items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForm(true);
                  }}
                >
                  <MdEmail size={24} color="white" />
                </button>
              </form>
              <p className="term-text">Already using PMS? <a href="https://proclient360.com/">Sign in.</a></p>
            </div>
            <div className="col-lg-6 text-center">
              <img 
                src="/static/assets/img/pms_herosection.png" 
                alt="Project Management" 
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>

        {/* <div className="partner-slider-two mt-130 md-mt-100">
          <div className="container">
            <p>Simplified scheduling for more than <span>10,000+ </span> meetings</p>
            <div className="partnerSliderTwo">
              {[
                { name: "AP", file: "AP.png" },
                { name: "Arai", file: "Arai.png" },
                { name: "CMMI", file: "CMMI.png" },
                { name: "EM", file: "EM.png" },
                { name: "JCB", file: "JCB.jpg" },
                { name: "Sahyadri", file: "Sahyadri.png" },
                { name: "Tata", file: "Tata.png" },
              ].map((logo, index) => (
                <div className="item" key={index}>
                  <div className="img-meta d-flex align-items-center">
                    <img 
                      src={`/images/${logo.file}`}
                      alt={`${logo.name} logo`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>

      {/* Fancy Feature Twenty Two */}
      <div className="fancy-feature-twentyTwo mt-200 md-mt-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-md-8 m-auto">
              <div className="title-style-eight text-center mb-40 md-mb-10">
                <h2>One Platform. For Any <span>Project</span> </h2>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="block-style-twentyTwo">
                <div className="icon d-flex align-items-center justify-content-center" style={{ background: '#FF4A8B' }}>
                  <i className="fas fa-tasks fa-2x text-white"></i>
                </div>
                <h4>Task Tracking</h4>
                <p>Track every task, every step, with complete clarity.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="block-style-twentyTwo">
                <div className="icon d-flex align-items-center justify-content-center" style={{ background: '#6D49FF' }}>
                  <i className="fas fa-project-diagram fa-2x text-white"></i>
                </div>
                <h4>Project Tracking</h4>
                <p>Keep track of every project step in real-time.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="block-style-twentyTwo">
                <div className="icon d-flex align-items-center justify-content-center" style={{ background: '#FFB951' }}>
                  <i className="fas fa-headset fa-2x text-white"></i>
                </div>
                <h4>Fast Support</h4>
                <p>Get quick, reliable support whenever you need it.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fancy Feature Twenty Three */}
      <div className="fancy-feature-twentyThree mt-170 md-mt-100" id="feature">
        <div className="container">
          <div className="title-style-nine text-center pb-180 md-pb-100">
            <h6>Our Features</h6>
            <h2>ProClient360 is all about Smart Planning, Seamless Collaboration, & <span>On-Time Delivery.</span></h2>
            <p>Our ProClient360 lets you plan, track, and deliver tasks effortlessly and on time.</p>
          </div>
          
          {/* Feature Blocks */}
          <div className="block-style-twentyThree">
            <div className="row align-items-center">
              <div className="col-lg-6 order-lg-last mr-auto">
                <div className="screen-container ml-auto">
                  <div className="oval-shape" style={{ background: '#69FF9C' }}></div>
                  <div className="oval-shape" style={{ background: '#FFF170' }}></div>
                  <img 
                    src="/static/assets/img/projecttask.png"
                    alt="Project & Task Management" 
                    className="shapes shape-one" 
                  />
                </div>
              </div>
              <div className="col-lg-5 order-lg-first">
                <div className="text-wrapper">
                  <h6>One click away</h6>
                  <h3 className="title">Project & Task Management</h3>
                  <p>Plan, assign, and track project tasks with real-time updates, Gantt views, and employee progress logs.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="block-style-twentyThree">
            <div className="row">
              <div className="col-lg-6">
                <div className="screen-container ml-auto">
                  <div className="oval-shape" style={{ background: '#FFDE69' }}></div>
                  <div className="oval-shape" style={{ background: '#FF77D9' }}></div>
                  <img 
                    src="/static/assets/img/integration.png" 
                    alt="Smart Lead Integration" 
                    className="shapes shape-two" 
                  />
                </div>
              </div>
              <div className="col-lg-5 mr-auto">
                <div className="text-wrapper">
                  <h6>SMART MANAGEMENT</h6>
                  <h3 className="title">Smart Lead Integration</h3>
                  <p>Automatically capture leads from platforms like IndiaMART, TradeIndia, Google, and LinkedIn—no technical setup required.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="block-style-twentyThree">
            <div className="row align-items-center">
              <div className="col-lg-6 order-lg-last mr-auto">
                <div className="screen-container ml-auto">
                  <div className="oval-shape" style={{ background: '#69FF9C' }}></div>
                  <div className="oval-shape" style={{ background: '#FFF170' }}></div>
                  <img 
                    src="/static/assets/img/gaintchart.png" 
                    alt="Gantt Charts" 
                    className="shapes shape-one" 
                  />
                </div>
              </div>
              <div className="col-lg-5 order-lg-first">
                <div className="text-wrapper">
                  <h6>Effortless Collaboration</h6>
                  <h3 className="title">Work together smoothly and efficiently</h3>
                  <p>Plan, assign, and track project tasks with real-time updates, Gantt views, and employee progress logs.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="block-style-twentyThree">
            <div className="row">
              <div className="col-lg-6">
                <div className="screen-container ml-auto">
                  <div className="oval-shape" style={{ background: '#C069FF' }}></div>
                  <div className="oval-shape" style={{ background: '#69FFFA' }}></div>
                  <img 
                    src="/static/assets/img/centralized.png" 
                    alt="Centralized Dashboard" 
                    className="shapes shape-one" 
                  />
                </div>
              </div>
              <div className="col-lg-5 mr-auto">
                <div className="text-wrapper">
                  <h6>Centralized Dashboard</h6>
                  <h3 className="title">All in One Place</h3>
                  <p>Get an instant, customizable overview of every project, service ticket, and team member's progress in one place.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="block-style-twentyThree">
            <div className="row align-items-center">
              <div className="col-lg-6 order-lg-last mr-auto">
                <div className="screen-container ml-auto">
                  <div className="oval-shape" style={{ background: '#69FF9C' }}></div>
                  <div className="oval-shape" style={{ background: '#FFF170' }}></div>
                  <img 
                    src="/static/assets/img/permissionbuttons.png" 
                    alt="Role-Based Permissions" 
                    className="shapes shape-one" 
                  />
                </div>
              </div>
              <div className="col-lg-5 order-lg-first">
                <div className="text-wrapper">
                  <h6>Role-Based Permissions</h6>
                  <h3 className="title">Access control by user role</h3>
                  <p>Give each employee exactly the access they need—nothing more, nothing less—via flexible department & designation controls.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="block-style-twentyThree">
            <div className="row">
              <div className="col-lg-6">
                <div className="screen-container ml-auto">
                  <div className="oval-shape" style={{ background: '#eeeff0' }}></div>
                  <div className="oval-shape" style={{ background: '#69D4FF' }}></div>
                  <img 
                    src="/static/assets/img/AutomatedReporting.png" 
                    alt="Automated Reporting" 
                    className="shapes shape-four" 
                  />
                </div>
              </div>
              <div className="col-lg-5 mr-auto">
                <div className="text-wrapper">
                  <h6>Automated Reporting & Analytics</h6>
                  <h3 className="title">Automatically collecting, analyzing, and presenting Data</h3>
                  <p>Turn raw data into actionable insights with one-click reports, Gantt charts, and customer feedback dashboards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fancy Feature Twenty Four */}
      <div className="fancy-feature-twentyFour pt-90 md-pt-60" id="service">
        <div className="container">
          <div className="title-style-nine text-center">
            <h6>Industries Include</h6>
            <h2>ProClient360 has the ability to serve Any <span>Business Segment</span></h2>
          </div>
        </div>
        <div className="bg-wrapper mt-100 md-mt-80">
          <a href="#feedback" className="click-scroll-button scroll-target d-flex justify-content-center">
            <i className="fas fa-arrow-down text-primary"></i>
          </a>
          <div className="container">
            <div className="row">
              {[
                { icon: 'laptop-code', title: 'Technology & Software', desc: 'Keep your dev teams aligned, sprint by sprint.', color: '#3FE193' },
                { icon: 'industry', title: 'Manufacturing & Engineering', desc: 'Schedule jobs, track service calls, and manage field teams with ease.', color: '#FF4F86' },
                { icon: 'briefcase', title: 'Professional Services', desc: 'Consulting firms, agencies, and legal practices: centralize client data and billing in one system.', color: '#FFCF39' },
                { icon: 'heartbeat', title: 'Healthcare & Pharma', desc: 'Ensure timely maintenance, compliance paperwork, and patient-facing service tickets.', color: '#6D64FF' },
                { icon: 'users', title: 'Personal meetings', desc: 'Counselling, Business, Advisory, Spiritual services & more.', color: '#E752FF' },
                { icon: 'graduation-cap', title: 'Education & Non-Profits', desc: 'Organize projects, volunteers, and stakeholder communications—all on budget, all on time.', color: '#29EEFB' }
              ].map((item, index) => (
                <div className="col-lg-6 d-flex mb-35" key={index}>
                  <div className="block-style-twentyFour">
                    <div className="d-flex align-items-start">
                      <div className="icon d-flex align-items-center justify-content-center" style={{ background: item.color }}>
                        <i className={`fas fa-${item.icon} fa-2x text-white`}></i>
                      </div>
                      <div className="text">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Client Feedback Slider Six */}
      <div className="client-feedback-slider-six mt-170 md-mt-120" id="feedback">
        <div className="inner-container">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 m-auto">
                <div className="title-style-nine text-center">
                  <h6>Testimonials</h6>
                  <h2>What's Our <span>Client</span> Think About Us.</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="clientSliderSix style-two">
            {[
              { text: "Since switching to ProClient360, our project delivery times have significantly improved. The platform keeps our entire team in sync, making collaboration smoother and more efficient.", name: "Saurabh Bansode", location: "Software User" },
              { text: "As a Software Manager, I’ve seen a noticeable improvement in our project delivery timelines since adopting ProClient360. It ensures the entire team stays aligned, improves transparency, and makes collaboration much smoother.", name: "Ganesh Galande", location: "Software Manager" },
              { text: "ProClient360 is a very useful software for our sales team — it saves time, streamlines tasks, and helps us work faster and more efficiently.", name: "Chaitanya Ghanote", location: "Sales Team" },
              { text: "ProClient360 is a very useful tool for tracking and managing services. It helps us monitor progress, stay organized, and deliver better service to our clients.", name: "Vitthal Hade", location: "Service Manager" }
            ].map((testimonial, index) => (
              <div className="item" key={index}>
                <div className="feedback-wrapper">
                  <span className="ribbon" style={{ background: testimonial.color }}></span>
                  <p>{testimonial.text}</p>
                  <div className="d-flex align-items-center">
                    <div className="avatar-circle bg-primary me-3 d-flex align-items-center justify-content-center text-white fw-bold" style={{ backgroundColor: testimonial.color }}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <h6 className="name">{testimonial.name}, <span>{testimonial.location}</span></h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Section One */}
      {/* <div className="partner-section-one mt-170 md-mt-90 pb-120 md-pb-80">
        <div className="container">
          <div className="title-style-nine text-center mb-100">
            <h6>Our Partners</h6>
            <h2>They <span>Trust Us,</span> & Vice Versa</h2>
          </div>
          
          <div className="row justify-content-center">
            {[
              { name: "AP", file: "AP.png" },
              { name: "Arai", file: "Arai.png" },
              { name: "Atlas", file: "Atlas.png" },
              { name: "CMMI", file: "CMMI.png" },
              { name: "JCB", file: "JCB.jpg" },
              { name: "Sahyadri", file: "Sahyadri.png" },
              { name: "Siemens", file: "Siemens.png" },
              { name: "Tata", file: "Tata.png" },
              { name: "EM", file: "EM.png" },
            ].map((logo, index) => (
              <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
                <div className="img-box">
                  <img 
                    src={`/images/${logo.file}`}
                    alt={`${logo.name} logo`} 
                    className="img-fluid" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Fancy Short Banner Ten */}
      <div className="fancy-short-banner-ten mt-170 md-mt-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-11 m-auto">
              <div className="text-center">
                <h2>Try ProClient360 Free</h2>
                <p>After your 14-day trial of our Professional plan, enjoy the Free version of Calendly – forever.</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="dropdown d-inline-block">
              <button
                className="download-btn btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Get ProClient360 App
              </button>

              <ul className="dropdown-menu shadow" aria-labelledby="dropdownMenuButton" style={{minWidth: '320px'}}>
                <li>
                  <a className="dropdown-item d-flex align-items-center justify-content-center" href="#">
                    <img
                      src="images/103.svg"
                      alt="Android"
                      style={{ width: "24px", marginRight: "8px" }}
                    />
                    <span>Android</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="info-text text-white mt-3">
              No Credit Card Required. Cancel Anytime
            </div>
          </div>
        </div>
      </div>

      {/* Footer Style Eight */}
      <footer className="theme-footer-eight mt-100">
        <div className="top-footer">
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-xl-4 col-lg-3 col-12 footer-about-widget">
                <div className="logo">
                  <a href="/">
                    <img src={`${process.env.PUBLIC_URL}/images/Black_logo.png`} className="logo_size" alt="Company Logo" />
                  </a>
                </div>
                <b>Address : </b>
                Office No.05, 3rd Floor,a Revati Arcade-II, Opposite to Kapil Malhar Society, Baner, Pune -411045, Maharashtra, India.
                <ul className="font-rubik mt-10">
                  <li><a href="mailto:support@proclient360.com">support@proclient360.com</a></li>
                  <li><a href="tel:18002097799" className="phone">97799 180020</a></li>
                </ul>
              </div>
              <div className="col-lg-3 col-md-4 footer-list">
                <h5 className="footer-title">Links</h5>
                <ul>
                  <li><a href="#home" onClick={(e) => { e.preventDefault(); handleScrollTo('home'); }}>Home</a></li>
                  <li><a href="#feature" onClick={(e) => { e.preventDefault(); handleScrollTo('feature'); }}>Features</a></li>
                  <li><a href="#service" onClick={(e) => { e.preventDefault(); handleScrollTo('service'); }}>Services</a></li>
                  <li><a href="#feedback" onClick={(e) => { e.preventDefault(); handleScrollTo('feedback'); }}>Feedback</a></li>
                </ul>
              </div>
              <div className="col-lg-3 col-md-4 footer-list">
                <h5 className="footer-title">Legal</h5>
                <ul>
                  <li><a href="#">Terms of use</a></li>
                  <li><a href="#">Terms &amp; conditions</a></li>
                  <li><a href="#">Privacy policy</a></li>
                  <li><a href="#">Cookie policy</a></li>
                </ul>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-4 footer-list">
                <h5 className="footer-title">Products</h5>
                <ul>
                  <li><a href="#">Take the tour</a></li>
                  <li><a href="#">Live chat</a></li>
                  <li><a href="#">Self-service</a></li>
                  <li><a href="#">Social</a></li>
                  <li><a href="#">Mobile</a></li>
                  <li><a href="#">deski Reviews</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="bottom-footer mt-50 md-mt-30">
            <div className="row">
              <div className="col-lg-6 order-lg-last mb-20">
                <ul className="d-flex justify-content-center justify-content-lg-end social-icon">
                  <li>
                    <a href="https://www.facebook.com/people/Daccess-Security-Systems-Pvt-Ltd/100064191305818/" target="_blank" rel="noopener noreferrer">
                      <FaFacebookF />
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/DaccessSystems" target="_blank" rel="noopener noreferrer">
                      <FaTwitter />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/daccess-security-systems/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                      <FaLinkedinIn />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 order-lg-first mb-20">
                <p className="copyright text-center text-lg-right">Copyright &copy; {new Date().getFullYear()} ProClient360 inc.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll Top Button */}
      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fa fa-angle-up" aria-hidden="true"></i>
      </button>

      {/* Sign In Form Modal */}
      {showForm && (
        <div className="signin-modal">
          <div className="signin-form">
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            <h3 className="form-title">Contact Us</h3>
            <form>
              <input type="text" className="form-input" placeholder="Your Name" required />
              <input type="email" className="form-input" placeholder="Your Email" required />
              <input type="tel" className="form-input" placeholder="Your Contact Number" required />
              <textarea className="form-textarea" placeholder="Your Message" required></textarea>
              <button type="submit" className="form-submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default ProClient360;