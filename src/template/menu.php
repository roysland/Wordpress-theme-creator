<?php 
/**
 * @package WordPress
 * @subpackage WP-Skeleton
 */
?> 
<header id="navbar">
    <div id="brand">
        <a href="<?php echo home_url(); ?>">
            <?php echo get_bloginfo('name');?>
        </a>
    </div>
    <?php wp_nav_menu( array('container' => 'nav', 'theme_location' => 'primary' ) ); ?>

    <a class="nav-hamburger">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
</a>
</header>