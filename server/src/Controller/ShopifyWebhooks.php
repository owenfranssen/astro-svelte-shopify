<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Shopify\Context;
use Shopify\Auth\FileSessionStorage;
use Shopify\Clients\Rest;

class ShopifyWebhooks
{

    public function connect(): Response
    {
        $number = random_int(0, 100);

        $session = Context::initialize(
          $_ENV['SHOPIFY_API_KEY'],
          $_ENV['SHOPIFY_API_SECRET'],
          $_ENV['SHOPIFY_APP_SCOPES'],
          $_ENV['SHOPIFY_APP_HOST_NAME'],
          new FileSessionStorage('/tmp/php_sessions'),
          '2022-07',
          true,
          false,
        );

        var_dump($session);

        $client = new Rest($session->getShop(), $session->getAccessToken());
        $response = $client->get('products');

        return $response;

        return new Response(
            '<html><body>Lucky number: '.$number.'</body></html>'
        );
    }
}
