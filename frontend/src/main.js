// Main function
import API from './api.js';

const api  = new API();
const homePage = document.getElementById('instacram')
const userPage = document.getElementById('user-page')
const largeFeed = document.getElementById('large-feed')
const loginPage = document.getElementById('register')
const registerPage = document.getElementById('info')
const login = document.getElementById('login_but')
const register = document.getElementById('register_but')
const register0 = document.getElementById('register_but0')
const profile = document.getElementById('profile')
const userprofile = document.getElementById("userprofile");      
const large_feed =  document.getElementById("large-feed");
const back = document.getElementById('back');
const back1 = document.getElementById('back1');
const changeprofile = document.getElementById('changeprofile');
const change_profile = document.getElementById('change_profile');
const Submit_change = document.getElementById('Submit_change');
const followed = document.getElementById('followed');
const unfollow = document.getElementById('unfollow');

// Click event-----login
login.addEventListener('click', () => {
        handleSubmitLogin();
        event.preventDefault();
        event.stopPropagation();
})

// Click event-----register
register.addEventListener('click', () => {
        handleSubmitRegister();
        event.preventDefault();
        event.stopPropagation();
})

// Click event-----finish rigister and go back to login page
register0.addEventListener('click', () => {
    loginPage.style.display = 'none';
    registerPage.style.display = 'block';
})

// Click event-----show my profile
profile.addEventListener('click', () => {
        showprofile();
        event.preventDefault();
        event.stopPropagation();
})

// Click event-----from my profile back to feed
back.addEventListener('click', () => {
      userprofile.style.display = "none";
      large_feed.style.display = "block";
})

// Click event-----from change profile page back to my profile
back1.addEventListener('click', () => {
      userprofile.style.display = "block";
      changeprofile.style.display = "none";
})

// Click event-----from followed profile page back to feed
document.getElementById('back_a').addEventListener('click', () => {
    document.getElementById('userprofile_followed').style.display = "none";
    large_feed.style.display = "block";
})

// Click event-----from unfollow profile page back to feed
document.getElementById('back_b').addEventListener('click', () => {
      document.getElementById('userprofile_unfollow').style.display = "none";
      large_feed.style.display = "block";
})

// Click event-----from my profile go to change profile page
change_profile.addEventListener('click', () => {
      userprofile.style.display = "none";
      changeprofile.style.display = "block";
})

// Click event-----change profile
Submit_change.addEventListener('click', () => {
      change_my_profile()
      event.preventDefault()
      event.stopPropagation()
})

// Click event-----followed page
followed.addEventListener('click', () => {
      my_followed()
      event.preventDefault()
      event.stopPropagation()
})

// Click event-----unfollow page
unfollow.addEventListener('click', () => {
      my_unfollow()
      event.preventDefault()
      event.stopPropagation()
})

// Login and show the feed
const handleSubmitLogin = () => {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const params =  "{\n  \"username\": \"" +username+ "\",\n  \"password\": \""+password+ "\"\n}";
	const Login = api.login(params);

	Login.then(res => {
        console.log('Login', res);

        if(res.token == undefined){
        	alert("Invalid username or password! Please try again!");
        	document.getElementById('username').value = '';
        	document.getElementById('password').value = '';
        }
        else{
        	alert("Login successful!");
        	document.getElementById('all').style.display = 'none';
        	document.getElementById('instacram').style.display = 'block';
            window.globaltoken = res.token;
        	const token = {
        		method: 'GET',
        		headers:{Authorization: "Token " + res.token},
        	};
        	console.log(token);

        	const feed = api.getFeed(token);
            console.log("Feed",feed);
               
        	feed
        	.then(posts => {
        		const post = posts.posts
        		post.reduce((parent, post) => {
        			parent.appendChild(createPostTile(post));
        			return parent;
        		}, document.getElementById('large-feed'))
        	});
        }
    })
}

// Register
const handleSubmitRegister = () => {
    const email = document.getElementById('email').value;
    const username = document.getElementById('log_username').value;
    const name = document.getElementById('name').value;
    const passwd1= document.getElementById('log_password1').value;
    const passwd2 = document.getElementById('log_password2').value;

    console.log(passwd1,passwd2);

    if(passwd1 != passwd2){
    	alert("Two password entries are not the same!");
    	document.getElementById('log_password1').value = '';
    	document.getElementById('log_password2').value = '';
    	return false;
    }

    const params =  "{\n  \"username\": \"" +username+ "\",\n  \"password\": \""+passwd1+"\",\n  \"email\": \""+email+"\",\n  \"name\": \""+name+ "\"\n}";
    const Register = api.register(params);

    Register.then(res => {
        console.log('Register', res);

        if (res.token == undefined) {
            alert("Informed information! Please try again!");
            document.getElementById('log_password1').value = '';
            document.getElementById('log_password2').value = '';
        }
        else{
            alert('Register successful!');
            document.getElementById('info').style.display = 'none';
            document.getElementById('register').style.display = 'block';
        }
    })
}

// Show my profile
const showprofile = () => {
    const token = {
        method: 'GET',
        headers:{Authorization: "Token " + globaltoken},
    };

    console.log('User', token);
    const User = api.getUser(token);

    User.then(res => {
        console.log('User', res);
        document.getElementById("my_username").innerHTML = res.username; 
        document.getElementById("my_email").innerHTML = res.email; 
        document.getElementById("my_name").innerHTML = res.name; 
        document.getElementById("my_following").innerHTML = res.followed_num; 
        userprofile.style.display = "block";
        large_feed.style.display = "none";
        changeprofile.style.display = "none";
        document.getElementById('userprofile_followed').style.display = "none";
        document.getElementById('userprofile_unfollow').style.display = "none";
    })
}

// Show other profile
const showuserprofile = (info) => {
    window.globalinfo = info;

    const token = {
        method: 'GET',
        headers:{Authorization: "Token " + globaltoken},
    };

    info = '?username='+info;
    console.log('User', token);
    const My = api.getUser(token);
    const User = api.getotherUser(token,info);

    My.then(res => {
        window.globalid = res.id;
    })

    User.then(res => {
        console.log('User', res); 
        var flag = 0; 
        for(var i=0;i < res.followed_num;i++){
            if(res.following == globalid){
                document.getElementById("my_username1").innerHTML = res.username; 
                document.getElementById("my_email1").innerHTML = res.email; 
                document.getElementById("my_name1").innerHTML = res.name; 
                document.getElementById("my_following1").innerHTML = res.followed_num;
                document.getElementById('userprofile_followed').style.display = "block";
                document.getElementById('userprofile_unfollow').style.display = "none";
                large_feed.style.display = "none";
                changeprofile.style.display = "none";
                flag = 1;
            }
        }
        if(flag == 0){
            document.getElementById("my_username2").innerHTML = res.username; 
            document.getElementById("my_email2").innerHTML = res.email; 
            document.getElementById("my_name2").innerHTML = res.name; 
            document.getElementById("my_following2").innerHTML = res.followed_num;
            document.getElementById('userprofile_unfollow').style.display = "block";
            document.getElementById('userprofile_followed').style.display = "none";
            large_feed.style.display = "none";
            changeprofile.style.display = "none";
        }
    })
}

// Change profile
const change_my_profile = () => {
    const email = document.getElementById('new_email').value;
    const name = document.getElementById('new_name').value;
    const passwd1= document.getElementById('new_password1').value;
    const passwd2 = document.getElementById('new_password2').value;

    if(passwd1 != passwd2){
        alert("Two password entries are not the same!");
        document.getElementById('new_password1').value = '';
        document.getElementById('new_password2').value = '';
        return false;
    }

    const params =  "{\n  \"email\": \"" +email+ "\",\n  \"name\": \""+name+"\",\n  \"password\": \""+passwd1+"\"\n}";
    const opts = {
        method: 'PUT',
        headers:{
                  'Authorization': "Token " + globaltoken,
                  'content-type': 'application/json'
                },
        body: params,
    };
    console.log(opts);

    const New_profile = api.postprofile(opts);
    New_profile.then(res => {
        console.log('New_profile', res);

        if(res.msg != "success"){
            alert("Invalid information! Please try again!");
        }
        else{
            alert("Success!");
            userprofile.style.display = "block";
            changeprofile.style.display = "none";
        }
    })
}

// Follow
const my_followed = () => {
    const token = {
        method: 'PUT',
        headers:{Authorization: "Token " + globaltoken},
    };
    const info = '?username='+globalinfo;
    api.follow(token,info);
    showuserprofile(globalinfo);
}

// Unfollow
const my_unfollow = () => {
    const token = {
        method: 'PUT',
        headers:{Authorization: "Token " + globaltoken},
    };
    const info = '?username='+globalinfo;
    api.unfollow(token,info);
    showuserprofile(globalinfo);
}

// Helper function------create post
function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });

    var feed_name = createElement('h2', 'Author: '+post.meta.author,{ class: 'post-title'});
 
    section.appendChild(feed_name);
    section.appendChild(createElement('h3',  post.meta.description_text, { class: 'post-content' }));
    section.appendChild(createElement('img', null, 
        { src: "data:image/png;base64,"+ post.src}));

    if(post.comments.length > 0){
    	section.appendChild(createElement('h2',  "Comment:", { class: 'post-content' }));
    	for(var i = 0;i <post.comments.length;i++){
    		section.appendChild(createElement('h4',post.comments[i].author+': '+post.comments[i].comment, { class: 'post-content' }));
    	}
    }
  
    if(post.meta.likes.length>0){
    	section.appendChild(createElement('h3','likes: ('+post.meta.likes.length+')', { class: 'post-content' }));
    }  

    section.appendChild(createElement('h4','---------------------------------------------------------------', { class: 'post-content' })); 

    feed_name.addEventListener('click', () => {
        showuserprofile(post.meta.author)
        event.preventDefault()
        event.stopPropagation()
    })

    return section;
}

// Helper function------create element
function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

// Helper function------upload image
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', uploadImage);

function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}






