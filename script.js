$(document).ready(function() {
    // Slick Carousel Initialization (keep this)
    $('.slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        arrows: true,
        centerMode: true,
        centerPadding: '40px',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    // Handle Book Button with Bottom Sheet
    $('.book button').on('click', function () {
        $('#bottomSheet').addClass('active');
        $('#overlay').addClass('active');
    });

    $('#overlay, .btn-cancel').on('click', function () {
        $('#bottomSheet').removeClass('active');
        $('#overlay').removeClass('active');
    });

    // Confirm booking and send email
    $('.btn-confirm').on('click', function () {
        $('#bottomSheet').removeClass('active');
        $('#overlay').removeClass('active');

        const name = localStorage.getItem("userName");
        const email = localStorage.getItem("userEmail");

        if (!email || !name) {
            alert("User info not found. Please sign up first.");
            return;
        }

        const emailData = {
            to: email,
            subject: 'Booking Confirmation - Aevum Nurse',
            text: `Hello ${name},\n\nAmount: 200rs\nSince the delay was caused by the patient, a charge of 100rs per hour will be applicable.\n\nRegards,\nAevum Nurse Team`
        };

        fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        })
        .then(response => response.json())
        .then(data => {
            alert('📧 Email sent successfully!');
            console.log(data);
        })
        .catch(error => {
            alert('❌ Failed to send email.');
            console.error(error);
        });
    });
    // 📍 Paper plane button click: Get current address and fill input
    $('.fa-paper-plane').parent('button').on('click', function (e) {
        e.preventDefault();
        getCurrentLocation();
    });

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            $('#cityInput').val("Geolocation not supported.");
        }
    }

    function showPosition(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const apiKey = 'ff2e49f7d62c485fa3d6007e26b28b1b'; // ✅ Your real API key
    
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const result = data.results[0];
                const address = result?.formatted || "Address not found";
                $('#cityInput').val(address); // ✅ full address in input
                localStorage.setItem("userAddress", address); // 🔐 save in localStorage if needed
            })
            .catch(error => {
                console.error("Geocoding error:", error);
                $('#cityInput').val("Error getting address");
            });
    }
    

    function showError(error) {
        let message = "Unknown error.";
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = "Permission denied.";
                break;
            case error.POSITION_UNAVAILABLE:
                message = "Position unavailable.";
                break;
            case error.TIMEOUT:
                message = "Request timed out.";
                break;
        }
        $('#cityInput').val(message);
    }
});
