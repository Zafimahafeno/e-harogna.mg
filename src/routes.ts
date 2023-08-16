import express, { Router } from 'express'
import {
	authenticatedUser,
	Login,
	Logout,
	Register,
	UpdateInfo,
	UpdatePassword,
	updateUserview,
	saveProfessionalExperience,
	saveFormation,
} from './controller/authController'

import {
	createCourseCat,
	createCourseCatView,
	DeleteCourseCat,
	fetchAllCourseCat,
	UpdateCourseCat,
} from './controller/CourseCat.controller'
import {
	createCourse,
	createCourseView,
	DeleteCourse,
	fetchAllCourse,
	fetchAllCoursebyCategoryFront,
	fetchAllCourseFront,
	fetchOneCourseFront,
	getOneCourse,
	UpdateCourse,
} from './controller/CourseController'
import { sendMail, sendmymailSendGrid } from './controller/emailController'
import { fetchAllfile, UploadFile, UploadFileJob, UploadImage } from './controller/imageController'
import {
	createJob,
	createJobView,
	DeleteJob,
	DeleteMyJob,
	fetchAllJob,
	fetchAllJobFront,
	getOneJob,
	postuleJobView,
	savemyJob,
	UpdateJob,
} from './controller/jobController'
import { fetchPermission } from './controller/permissionController'
import { createRole, DeleteRole, fetchRole, getOneRole, UpdateRole } from './controller/roleController'
import {
	createCV,
	createUser,
	createUserFront,
	DeleteUser,
	DisableUser,
	EnableUser,
	fetchAllUser,
	getOneUser,
	UpdateUser,
} from './controller/userController'
import { authMiddleware } from './middleware/auth.middleware'
import { permissionMiddleware } from './middleware/permission.middleware'


// Pour charger des fichiers json
const fs = require('fs');
export const routes = (router: Router) => {
	router.get('/test', function (req, res) {
		res.render('V1/pages/test')
	})

	router.get('/compte', function (req, res) {
		res.render('V1/pages/compte', {
			type_abonement: "annuel"
		})
	})

	router.get('/login', function (req, res) {
		res.render('Auth/login', {
			page_name: 'login',
			title: 'authentification',
		})
	})

	router.get('/register', function (req, res) {
		const type = req.query.type
		res.render('Auth/register', {
			type,
			page_name: 'register',
			title: "S'inscrire",
		})
	})

	router.get('/pricing', function (req, res) {
		res.render('pages/pricing', {
			page_name: 'Pricing',
			title: 'Nos Prix',
		})
	})

	router.get('/', function (req, res) {
		return res.render('V1/pages/home', {
			page_name: 'accuel',
			title: 'accueil',
		})
	})
	router.get('/cours-document', function (req, res) {
		res.render('V1/pages/cours-document')
	})
	router.get('/origami-tech', function (req, res) {
		res.render('V1/origamiSite/index')
	})
	
	router.get('/cours-video', function (req, res) {
		res.render('V1/pages/cours-video')
	})
	
	router.get('/CreateCourSkills', function (req, res) {
		res.render('V1/pages/CreateCourSkills')
	})
	router.get('/CreateCourWeb', function (req, res) {
		res.render('V1/pages/CreateCourWeb')
	})
	router.get('/CreateCourGestion', function (req, res) {
		res.render('V1/pages/CreateCourGestion')
	})
	router.get('/CreateCourPAO', function (req, res) {
		res.render('V1/pages/CreateCourPAO')
	})
	router.get('/CreateCourBureautique', function (req, res) {
		res.render('V1/pages/CreateCourBureautique')
	})
	router.get('/CreateCourEmbauche', function (req, res) {
		res.render('V1/pages/CreateCourEmbauche')
	})
	router.get('/cours-embauche', function (req, res) {
		res.render('V1/pages/cours-embauche')
	})
	router.get('/cours-bureautique', function (req, res) {
		res.render('V1/pages/cours-bureautique')
	})
	router.get('/cours-gestion', function (req, res) {
		res.render('V1/pages/cours-gestion')
	})


	router.get('/showuser', function (req, res) {
		res.render('views/user/show')
	})
	router.get('/cours-pao', function (req, res) {
		res.render('V1/pages/cours-pao')
	})
	router.get('/cours-skills', function (req, res) {
		res.render('V1/pages/cours-skills')
	})
	router.get('/edit', function (req, res) {
		res.render('course/edit')
	})
	router.get('/cours-web', function (req, res) {
		res.render('V1/pages/cours-web')
	})
	router.get('/creercours', function (req, res) {
		res.render('V1/pages/creercours')
	})
	router.get('/ateliers-et-presentiels', function (req, res) {
		res.render('V1/pages/ateliers-et-presentiels')
	})

	router.get('/formations', function (req, res) {
		res.render('V1/pages/formations')
	})

	router.get('/preparer-embauche', function (req, res) {
		res.render('V1/pages/preparer-embauche')
	})

	router.get('/soft-skills', function (req, res) {
		res.render('V1/pages/soft-skill')
	})

	router.get('/tarifs', function (req, res) {
		res.render('V1/pages/tarifs', { 
			data: JSON.parse(fs.readFileSync('src/data/tarifs.json'))
		})
	})

	router.get('/nos-coups-de-pouce', function (req, res) {
		res.render('V1/pages/nos-coups-de-pouce')
	})

	router.get('/slide-component', function (req, res) {
		res.render('V1/pages/slide')
	})

	router.get('/compte-annuel', function (req, res) {
		res.render('V1/pages/compte-annuel')
	})

	router.get('/compte-annuel-vip', function (req, res) {
		res.render('V1/pages/compte-annuel-vip')
	})

	router.get('/inscription', function (req, res) {
		req.flash('danger', "Une erreur s'est produite. Veuillez réessayer.");
		res.render('V1/pages/inscription', {
			dangerFlash: req.flash('danger'),
		});
	});	

	router.get('/inscription2', function (req, res) {
		res.render('V1/pages/inscription2')
	});

	router.get('/inscriptionstep2', function (req, res) {
		res.render('V1/pages/inscriptionstep2')
	})
	router.get('/inscriptionstep3', function (req, res) {
		res.render('V1/pages/inscriptionstep3')
	})

	router.get('/inscriptionstep2', function (req, res) {
		res.render('V1/pages/inscriptionstep2')
	})

	router.get('/inscriptionstep3', function (req, res) {
		res.render('V1/pages/inscriptionstep3')
	})

	router.get('/login-register', function (req, res) {
		req.flash('success', "Votre compte a été créé, nous vous contacterons pour l'activation.");
		res.render('V1/pages/sigin-in-register',{
			successFlash: req.flash('success')
		})
	})

	router.get('/ced-pages', function (req, res) {
		res.render('V1/pages/ced-pages')
	})

	router.get('/valid', function (req, res) {
		res.render('V1/pages/test-step-valid')
	})
	router.get('/update', function (req, res) {
		res.render('views/user/edit')
	})

	router.get('/emplois', fetchAllJobFront)

	// formations

	router.get('/skills', function (req, res) {
		res.render('V1/pages/liste-formations', {
			formation: JSON.parse(fs.readFileSync('src/data/formation_soft_skill.json'))
		})
	})

	router.get('/embauche', function (req, res) {
		res.render('V1/pages/liste-formations', {
			formation: JSON.parse(fs.readFileSync('src/data/formation_preparation_embauche.json'))
		})
	})

	router.get('/metier-web', function (req, res) {
		res.render('V1/pages/liste-formations', {
			formation: JSON.parse(fs.readFileSync('src/data/formation_metier_du_web.json'))
		})
	})

	router.get('/pao-et-design', function (req, res) {
		res.render('V1/pages/liste-formations', {
			formation: JSON.parse(fs.readFileSync('src/data/formation_pao_design.json'))
		})
	})

	router.get('/bureautique', function (req, res) {
		res.render('V1/pages/liste-formations', {
			formation: JSON.parse(fs.readFileSync('src/data/formation_bureautique.json'))	
		})
	})

	router.get('/autres', function (req, res) {
		res.render('V1/pages/liste-formations', {
			formation: JSON.parse(fs.readFileSync('src/data/formation_autres.json'))
		})
	})

	router.get('/gestion', function (req, res) {
		res.render('V1/pages/liste-formations', {
			formation: JSON.parse(fs.readFileSync('src/data/formation_gestion_projet.json'))
		})
	})


	router.get('/welcome', authMiddleware, permissionMiddleware('Course'), function (req, res) {
		return res.render('pages/Home', {
			page_name: 'accueil',
			title: 'accueil',
		})
	})

	router.get('/blog', authMiddleware, fetchAllCourseFront)
	router.get('/blog/:id', authMiddleware, fetchOneCourseFront)
	router.get('/files', authMiddleware, permissionMiddleware('Course'), fetchAllfile)
	router.get('/courses/category/:cat', authMiddleware, fetchAllCoursebyCategoryFront)
	router.get('/mails', sendmymailSendGrid)
	router.get('/courses', authMiddleware, permissionMiddleware('Course'), fetchAllCourse)
	router.get('/course/create', authMiddleware, permissionMiddleware('Course'), createCourseView)
	router.post('/api/course/create', authMiddleware, permissionMiddleware('Course'), UploadFile, createCourse)
	router.put('/api/course/:id', authMiddleware, permissionMiddleware('Course'), UpdateCourse)
	router.get('/course/view/:id', authMiddleware, getOneCourse)
	router.get('/api/delete/course/:id', authMiddleware, permissionMiddleware('Course'), DeleteCourse)

	router.get('/categories', authMiddleware, permissionMiddleware('Course'), fetchAllCourseCat)

	router.get('/category/create', authMiddleware, permissionMiddleware('Course'), createCourseCatView)
	router.post('api/category/create', authMiddleware, permissionMiddleware('Course'), UploadImage, createCourseCat)
	router.put('/api/category/:id', authMiddleware, permissionMiddleware('Course'), UpdateJob)
	router.get('/api/delete/category/:id', authMiddleware, permissionMiddleware('Course'), DeleteCourseCat)

	// router.get('/jobs-for-me', authMiddleware, fetchAllJobFront);
	router.get('/jobs', authMiddleware, permissionMiddleware('Job'), fetchAllJob)
	router.get('/job/save/:id', authMiddleware, permissionMiddleware('Job'), savemyJob)
	router.get('/job/postuler/:id', authMiddleware, postuleJobView)
	router.get('/job/create', authMiddleware, permissionMiddleware('Job'), createJobView)
	router.get('/job/view/:id', authMiddleware, getOneJob)
	router.post('/api/job/create', authMiddleware, permissionMiddleware('Job'), UploadFileJob, createJob)
	router.post('/api/job/postuler', authMiddleware, UploadFileJob, createJob)
	router.put('/api/job/:id', authMiddleware, permissionMiddleware('Job'), UpdateJob)
	router.get('/api/delete/job/:id', authMiddleware, permissionMiddleware('Job'), DeleteJob)

	router.post('/api/saveProfessionalExperience', saveProfessionalExperience);
	router.post('/api/saveFormation', saveFormation)

	router.post('/api/register', Register)
	router.post('/api/login', Login)
	router.get('/logout', Logout)

	router.post('/api/logout', authMiddleware, Logout)
	router.get('/me', authMiddleware, authenticatedUser)
	router.get('/update/user', authMiddleware, updateUserview)
	router.put('/api/user/update', authMiddleware, UpdateInfo)
	router.post('/api/user/update/password', authMiddleware, UpdatePassword)
	router.post('/api/user/create-cv', authMiddleware, createCV)

	router.get('/users/create', authMiddleware, permissionMiddleware('User'), createUserFront)
	router.get('/users', authMiddleware, permissionMiddleware('User'), fetchAllUser)
	router.get('/api/users/:id', authMiddleware, permissionMiddleware('User'), getOneUser)
	router.post('/api/users', authMiddleware, permissionMiddleware('User'), createUser)
	router.put('/api/users/:id', authMiddleware, permissionMiddleware('User'), UpdateUser)
	router.get('/api/delete/users/:id', authMiddleware, permissionMiddleware('User'), DeleteUser)
	router.get('/api/users/enable/:id', authMiddleware, permissionMiddleware('User'), EnableUser)
	router.get('/api/users/disable/:id', authMiddleware, permissionMiddleware('User'), DisableUser)

	router.get('/api/permission', authMiddleware, permissionMiddleware('Role'), fetchPermission)

	router.get('/api/role', authMiddleware, permissionMiddleware('Role'), fetchRole)
	router.get('/api/role/:id', authMiddleware, permissionMiddleware('Role'), getOneRole)
	router.post('/api/role', authMiddleware, permissionMiddleware('Role'), createRole)
	router.put('/api/role/:id', authMiddleware, permissionMiddleware('Role'), UpdateRole)
	router.get('/api/delete/role/:id', authMiddleware, permissionMiddleware('Role'), DeleteRole)

	router.post('/api/upload', UploadImage)

	router.use('/api/uploads', express.static('./upload'))
	router.use('/assets', express.static('./assets'))
}
