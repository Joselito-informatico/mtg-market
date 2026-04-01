import { Router } from 'express'
import { cardsRoutes } from '../modules/cards/cards.routes'

const router = Router()

// Registrar módulos aquí a medida que se implementan
router.use('/cards', cardsRoutes)

// Próximos módulos (M1-M3):
// router.use('/decks', decksRoutes)
// router.use('/collection', collectionRoutes)
// router.use('/marketplace', marketplaceRoutes)
// router.use('/users', usersRoutes)
// router.use('/feedback', feedbackRoutes)

export { router as apiRoutes }